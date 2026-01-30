import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const headers = JSON.parse(formData.get("headers") as string || "[]");
        const file = formData.get("file") as File;

        if (!file || headers.length === 0) {
            return NextResponse.json({ error: "File and headers are required" }, { status: 400 });
        }

        // Convert File to base64
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const mimeType = file.type;

        // Prepare the prompt
        const prompt = `You are an advanced OCR system specialized in extracting structured data from files, including images and PDF documents.

**TASK**: Extract data from the file into a JSON Array.
The target structure for EACH item in the array is based on these headers:
${headers.map((h: string, i: number) => `${i + 1}. ${h}`).join('\n')}

**INSTRUCTIONS**:
1. **Analyze the File Structure**:
   - If the file is a **Table**, extract each row as a separate item.
   - If the file contains **Multiple Documents** (e.g. multiple certificates pages or grid), extract each document as a separate item.
   - If the file contains a **Single Document**, extract it as a single item in the array.

2. **Map Data to Headers**:
   - intelligently map the text found in the image to the most appropriate header.
   - If a specific header field is not found in a row/document, set it to an empty string "".

3. **Format**:
   - Return ONLY a valid JSON Array: \`[ {"header1": "val1"}, {"header1": "val2"} ]\`
   - Do NOT include markdown code blocks (like \`\`\`json). Just the raw JSON string.

**content**:`;

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Server Configuration Error: GEMINI_API_KEY is missing." }, { status: 500 });
        }

        // Call Gemini API directly using v1beta
        // Using gemini-1.5-flash-latest to ensure we hit a valid alias, or fallback to gemini-1.5-flash
        const model = "gemini-1.5-flash";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: mimeType,
                                data: base64
                            }
                        }
                    ]
                }]
            })
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error(`Gemini API Error (${apiResponse.status}):`, errorText);
            throw new Error(`Gemini API returned ${apiResponse.status}: ${errorText}`);
        }

        const apiResult = await apiResponse.json();

        if (!apiResult.candidates || apiResult.candidates.length === 0) {
            throw new Error("Gemini returned no candidates. The image might be blocked or unclear.");
        }

        const text = apiResult.candidates[0].content.parts[0].text;

        // Parse JSON from response
        let jsonText = text.trim();
        // Remove markdown formatting if present
        jsonText = jsonText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");

        let parsedResult;
        try {
            parsedResult = JSON.parse(jsonText);
        } catch (e) {
            console.error("Failed to parse Gemini JSON:", jsonText);
            throw new Error("Failed to parse OCR result. AI returned invalid JSON.");
        }

        // Ensure result is always an array
        const resultsArray = Array.isArray(parsedResult) ? parsedResult : [parsedResult];

        // Normalize data to ensure all headers exist
        const normalizedData: Record<string, string>[] = resultsArray.map((item: any) => {
            const rowData: Record<string, string> = {};
            headers.forEach((h: string) => {
                rowData[h] = item[h] ? String(item[h]) : "";
            });
            return rowData;
        });

        return NextResponse.json({
            success: true,
            data: normalizedData
        });

    } catch (error) {
        console.error("Gemini OCR Error:", error);
        // Return the actual error message to the client for simpler debugging
        return NextResponse.json({
            error: error instanceof Error ? error.message : "Unknown error during OCR processing",
            details: error instanceof Error ? error.message : undefined
        }, { status: 500 });
    }
}

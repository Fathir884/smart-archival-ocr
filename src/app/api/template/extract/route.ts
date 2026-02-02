import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "File is required" }, { status: 400 });
        }

        // Convert File to base64
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const mimeType = file.type;

        // Prepare the prompt
        const prompt = `You are an expert data analyst. 
Analyze this image, which is a screenshot of a spreadsheet, form, or document template.
Your task is to **extract the column headers** or **field names**.

**Instructions**:
1. Identify the meaningful column headers or input labels (e.g., "Nama", "Date", "Address", "Total", etc.).
2. Ignore standard boilerplate text or title text that isn't a column header.
3. Return the headers as a simple JSON Array of strings.

**Example Output**:
[\"Name\", \"Date of Birth\", \"Phone Number\", \"Address\"]

**Response**:`;

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Server Configuration Error: GEMINI_API_KEY is missing." }, { status: 500 });
        }

        // Using Gemini 2.5 Flash
        const model = "gemini-2.5-flash";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
            throw new Error(`Gemini API returned ${apiResponse.status}: ${errorText}`);
        }

        const apiResult = await apiResponse.json();

        if (!apiResult.candidates || apiResult.candidates.length === 0) {
            throw new Error("Gemini returned no candidates.");
        }

        const text = apiResult.candidates[0].content.parts[0].text;

        // Clean and parse JSON
        let jsonText = text.trim();
        jsonText = jsonText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");

        let headers: string[];
        try {
            headers = JSON.parse(jsonText);
            if (!Array.isArray(headers)) headers = [String(headers)]; // Fallback
        } catch (e) {
            console.error("Failed to parse Gemini Template JSON:", jsonText);
            throw new Error("Failed to parse template headers. AI did not return a valid list.");
        }

        return NextResponse.json({ success: true, headers });

    } catch (error) {
        console.error("Template Extraction Error:", error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : "Unknown error",
        }, { status: 500 });
    }
}

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
        const prompt = `You are an advanced OCR system specialized in extracting data from Indonesian certificates and documents.

**TASK**: Extract the following fields from this certificate image:
${headers.map((h: string, i: number) => `${i + 1}. ${h}`).join('\n')}

**INSTRUCTIONS**:
- Read the text carefully, even if there's decorative background (batik patterns, watermarks)
- For bilingual certificates (Indonesian + English), prefer the Indonesian text
- Return ONLY valid JSON in this exact format:
{
  "${headers[0]}": "extracted value here",
  "${headers[1]}": "extracted value here"
}

**IMPORTANT RULES**:
1. If a field is not found, use empty string ""
2. For "Nama" or "Penerima": Use the person's full name in UPPERCASE (e.g., "WIDIA PERMANA")
3. For "No" or "Nomor": Include all digits and separators (e.g., "910100 2912 0000142 2016")
4. For "No Reg": Include prefix if present (e.g., "PRP 107 000105 2016")
5. For "Bidang" or "Kualifikasi": Include full Indonesian text (ignore English translation)
6. For dates: Use format "Jakarta, 01 Desember 2016" (City, DD Month YYYY)
7. Do NOT include any markdown formatting, explanations, or extra text - ONLY the JSON object

Extract the data now:`;

        // Call Gemini API directly using v1beta with Gemini 2.5 Flash (confirmed available)
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

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
            throw new Error(`Gemini API Error (${apiResponse.status}): ${errorText}`);
        }

        const apiResult = await apiResponse.json();
        const text = apiResult.candidates[0].content.parts[0].text;

        // Parse JSON from response
        let jsonText = text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/g, '');
        }

        const extractedData = JSON.parse(jsonText);

        // Ensure all headers are present
        const data: Record<string, string> = {};
        headers.forEach((h: string) => {
            data[h] = extractedData[h] || "";
        });

        return NextResponse.json({
            success: true,
            data
        });

    } catch (error) {
        console.error("Gemini OCR Error:", error);
        return NextResponse.json({
            error: "Failed to process document with Gemini Vision. Please check your API key and try again.",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

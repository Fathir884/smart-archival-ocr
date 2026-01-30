/**
 * Call Gemini Vision API via server-side API route
 * @param file - The image file to process
 * @param headers - The expected column headers for structured extraction
 * @param onProgress - Progress callback
 * @returns Structured data extracted from the image
 */
export async function performGeminiOCR(
    file: File,
    headers: string[],
    onProgress?: (progress: number) => void
): Promise<Record<string, string>[]> {
    try {
        if (onProgress) onProgress(10);

        // Prepare FormData
        const formData = new FormData();
        formData.append('file', file);
        formData.append('headers', JSON.stringify(headers));

        if (onProgress) onProgress(30);

        // Call server-side API route
        const response = await fetch('/api/gemini-ocr', {
            method: 'POST',
            body: formData
        });

        if (onProgress) onProgress(80);

        let result;
        try {
            result = await response.json();
        } catch (syntaxError) {
            throw new Error(`Failed to parse server response. Status: ${response.status}. Text: ${response.statusText}`);
        }

        if (!response.ok || !result.success) {
            throw new Error(result.error || result.details || `Server Error: ${response.status} ${response.statusText}`);
        }

        if (onProgress) onProgress(100);

        return result.data;

    } catch (error: any) {
        console.error("Gemini OCR Error:", error);
        // Throw the raw message to avoid masking it with generic text
        throw new Error(error.message || String(error) || "Unknown error occurred");
    }
}

/**
 * Legacy functions kept for compatibility
 */
export async function performOCR(file: File, onProgress?: (progress: number) => void): Promise<string> {
    return "";
}

export function parseOCRResult(text: string, headers: string[]): Record<string, string> {
    const data: Record<string, string> = {};
    headers.forEach(h => data[h] = "");
    return data;
}

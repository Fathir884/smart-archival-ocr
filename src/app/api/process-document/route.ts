import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const headers = JSON.parse(formData.get("headers") as string || "[]");
        const file = formData.get("file");

        if (!file || headers.length === 0) {
            return NextResponse.json({ error: "File and headers are required" }, { status: 400 });
        }

        // --- MOCK AI PROCESSING ---
        // In production, this would send the file buffer + headers prompt to Gemini 1.5 Flash
        // prompt: `Extract data from this image for the following fields: ${headers.join(", ")}. Return JSON.`

        await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate AI thinking time

        const mockResult: Record<string, string> = {};
        headers.forEach((h: string) => {
            // Generate believable mock data based on header name
            const lowerH = h.toLowerCase();
            if (lowerH.includes("no") || lowerH.includes("nomor")) mockResult[h] = "045/SK/VIII/2026";
            else if (lowerH.includes("tgl") || lowerH.includes("tanggal")) mockResult[h] = "29 Januari 2026";
            else if (lowerH.includes("perihal") || lowerH.includes("tentang") || lowerH.includes("judul")) mockResult[h] = "Undangan Rapat Koordinasi MBKM";
            else if (lowerH.includes("dari") || lowerH.includes("pengirim")) mockResult[h] = "Kementerian Pendidikan";
            else if (lowerH.includes("kepada") || lowerH.includes("penerima")) mockResult[h] = "Rektor Universitas Teknologi";
            else if (lowerH.includes("ringkasan") || lowerH.includes("isi") || lowerH.includes("deskripsi")) mockResult[h] = "Surat ini berisi undangan pembahasan kurikulum baru untuk semester ganjil tahun ajaran 2026/2027.";
            else if (lowerH.includes("nama")) mockResult[h] = "Budi Santoso";
            else mockResult[h] = `[Isi Scan ${h}]`;
        });
        // ---------------------------

        return NextResponse.json({
            success: true,
            data: mockResult
        });

    } catch (error) {
        return NextResponse.json({ error: "Processing failed" }, { status: 500 });
    }
}

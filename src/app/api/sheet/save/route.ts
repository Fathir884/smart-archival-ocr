import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !(session as any).accessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { url, data } = await request.json(); // data is Record<string, string>

        if (!url || !data) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Extract Spreadsheet ID from URL
        const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        if (!match) {
            return NextResponse.json({ error: "Invalid Spreadsheet URL" }, { status: 400 });
        }
        const spreadsheetId = match[1];

        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: (session as any).accessToken });

        const sheets = google.sheets({ version: "v4", auth });

        // 1. Fetch Headers again to ensure we map data to correct columns index
        const headerRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: "A1:Z1",
        });
        const headers = headerRes.data.values?.[0] || [];

        // 2. Map data object to row array based on headers
        let values: string[][] = [];

        if (Array.isArray(data)) {
            // Handle Array of Data (Batch)
            values = data.map((item: any) => {
                return headers.map(header => item[header] || "");
            });
        } else {
            // Handle Single Object (Legacy)
            const rowValues = headers.map(header => data[header] || "");
            values = [rowValues];
        }

        // 3. Append to Sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: "A1", // Append after the last row
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: values,
            },
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Append Error:", error);
        return NextResponse.json({ error: "Failed to save to sheet." }, { status: 500 });
    }
}

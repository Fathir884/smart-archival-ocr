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

        const { url } = await request.json();
        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
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

        // Fetch the first row (headers)
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: "A1:Z1", // Assuming headers are in the first row
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            return NextResponse.json({ error: "Sheet is empty or headers not found in row 1" }, { status: 400 });
        }

        const headers = rows[0];

        return NextResponse.json({
            success: true,
            headers: headers,
            sheetName: spreadsheetId // Or fetch title if needed
        });

    } catch (error: any) {
        console.error("Sheet Error:", error);
        // Return the actual error message from Google to help debugging (e.g., "API not enabled")
        const message = error.message || "Failed to fetch sheet";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

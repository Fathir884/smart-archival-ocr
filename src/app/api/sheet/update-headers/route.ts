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

        const { url, headers } = await request.json();

        if (!url || !headers || !Array.isArray(headers)) {
            return NextResponse.json({ error: "URL and Headers array are required" }, { status: 400 });
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

        // Update the first row (A1) with the new headers
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: "A1",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [headers],
            },
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Update Headers Error:", error);
        return NextResponse.json({
            error: error.message || "Failed to update headers",
        }, { status: 500 });
    }
}

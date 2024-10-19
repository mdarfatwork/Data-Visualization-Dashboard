import { NextResponse } from "next/server";
import { google } from 'googleapis';

const cache = new Map();

export async function GET() {
    const cacheKey: string = 'google-sheet-data'; // Define a cache key

    if (cache.has(cacheKey)) {
        // Return cached data if available
        return NextResponse.json({ data: cache.get(cacheKey) });
    }
    
    try {
        const sheets = google.sheets('v4');
    const auth = new google.auth.GoogleAuth({
      // This assumes you're using an API key from Google Cloud
      keyFile: './google-sheet-key.json', // Replace with your service account file
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    
    // Auth client
    const authClient = await auth.getClient();
    
    // Spreadsheet ID and range (the URL you provided)
    const spreadsheetId = '1l7GstWHc69HPV0irSdvoMIyHgtufUPKsbtCiNw7IKR0';
    const range = 'Sheet3!A1:I105'; // Update the range to what you need

    const response = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range,
    } as any);

    // Return the data from the Google Sheet
    const rows = response.data.values;

    if (rows && rows.length > 0) {
        cache.set(cacheKey, rows); // Cache the fetched data
      return NextResponse.json({ data: rows });
    } else {
      return NextResponse.json({ message: 'No data found' });
    }
    } catch (error) {
        console.error(`This is the Error of catch block in get data is ${error}`);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
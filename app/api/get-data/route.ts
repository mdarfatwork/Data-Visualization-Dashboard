import { NextResponse } from "next/server";
import { google } from 'googleapis';
import fs from 'fs';

const cache = new Map();

export async function GET() {
  const cacheKey: string = 'google-sheet-data'; // Define a cache key

  if (cache.has(cacheKey)) {
    // Return cached data if available
    return NextResponse.json({ data: cache.get(cacheKey) });
  }

  try {
    // Load the Google Service JSON credentials directly
    const credentials = JSON.parse(fs.readFileSync('google-sheet-service.json', 'utf-8'));

    // Authenticate with Google API using the service account key
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    // Create the sheets client with the authenticated credentials
    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch data from the specific sheet and range (Sheet3!A1:I105)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: '1l7GstWHc69HPV0irSdvoMIyHgtufUPKsbtCiNw7IKR0',
      range: 'Sheet3!A1:I105',
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ data: [], message: 'No data found' });
    }

    // Cache the data for future requests
    cache.set(cacheKey, rows);

    // Return the fetched data as JSON
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error(`This is the Error of catch block in get data is ${error}`);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
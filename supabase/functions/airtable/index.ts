import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { corsHeaders } from '../_shared/cors.ts'

interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

async function makeRequest(url: string, options = {}) {
  const airtableApiKey = Deno.env.get("AIRTABLE_API_KEY");
  const baseId = Deno.env.get("AIRTABLE_BASE_ID");
  
  const baseUrl = `https://api.airtable.com/v0/${baseId}`;
  
  return fetch(`${baseUrl}${url}`, {
    ...options,
    headers: {
      "Authorization": `Bearer ${airtableApiKey}`,
      "Content-Type": "application/json",
    },
  });
}

async function fetchTableRecords(tableName: string): Promise<AirtableRecord[]> {
  const response = await makeRequest(`/${tableName}`);
  
  if (!response.ok) {
    console.error("Failed to fetch Airtable records:", response.statusText);
    return [];
  }

  const { records } = await response.json();
  return records;
}

async function fetchRecord(tableName: string, recordId: string): Promise<AirtableRecord | null> {
  const response = await makeRequest(`/${tableName}/${recordId}`);
  
  if (!response.ok) {
    console.error("Failed to fetch Airtable record:", response.statusText);
    return null;
  }

  return response.json();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { tableName, recordId } = await req.json();

    if (!tableName) {
      throw new Error('Table name is required');
    }

    const data = await (recordId 
      ? fetchRecord(tableName, recordId) 
      : fetchTableRecords(tableName)
    );

    return new Response(
      JSON.stringify({ data }), 
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error in airtable function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
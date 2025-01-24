import { createClient } from "@supabase/supabase-js";

const edgeLocal = import.meta.env.VITE_APP_EDGE_LOCAL as string;
const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY;

const supabaseEdge = edgeLocal === 'true' 
  ? createClient('http://127.0.0.1:54321', 'local-key')
  : createClient(supabaseUrl, supabaseKey);

interface EdgeFunctionOptions {
  functionName: string;
  body: any;
}

export const callEdgeFunction = async ({ functionName, body }: EdgeFunctionOptions) => {
  try {
    const { data, error } = await supabaseEdge.functions.invoke(functionName, {
      body: JSON.stringify(body),
    });

    if (error) {
      console.error(`Edge function ${functionName} failed:`, error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error(`Edge function ${functionName} error:`, error);
    return { data: null, error };
  }
};
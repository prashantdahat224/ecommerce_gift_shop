 




import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export const handler = async (event) => {
  try {
    // pagination from frontend
    const from = Number(event.queryStringParameters?.from || 0);
    const to = Number(event.queryStringParameters?.to || 29);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("priority_score", { ascending: false, nullsFirst: false })
      .range(from, to);

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
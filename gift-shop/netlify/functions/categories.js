
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const handler = async () => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id,name,category_image")
      .order("trending_score", { ascending: false })
      .limit(8);

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }

    // convert storage path → public URL
    const withUrls = data.map(cat => {
      if (!cat.category_image) return cat;

      const { data: urlData } = supabase
        .storage
        .from("category-images")
        .getPublicUrl(cat.category_image);

      return {
        ...cat,
        category_image: urlData.publicUrl
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(withUrls)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};






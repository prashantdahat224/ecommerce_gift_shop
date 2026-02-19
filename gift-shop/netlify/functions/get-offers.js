import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export const handler = async () => {
  try {
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .in("id", ["offer1", "offer2", "offer3", "offer4"])
      .order("priority_score", { ascending: false, nullsFirst: false });

    if (error) throw error;

    // convert storage path → public URL
    const offersWithUrls = (data || []).map((offer) => {
      let imageUrl = offer.image_url || "";

      if (imageUrl) {
        const { data: urlData } = supabase.storage
          .from("offers")
          .getPublicUrl(imageUrl);

        imageUrl = urlData.publicUrl;
      }

      return { ...offer, public_url: imageUrl };
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(offersWithUrls),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
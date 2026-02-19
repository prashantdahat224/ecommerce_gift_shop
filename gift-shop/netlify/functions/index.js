// export async function handler() {
//   return {
//     statusCode: 200,
//     body: JSON.stringify({
//       SUPABASE_URL_exists_2: !!process.env.SUPABASE_URL,  
//       SUPABASE_KEY_exists_2: !!process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
//          ? process.env.SUPABASE_URL.substring(0, 30) + "..."
//         : null,
//     }),
//   };
// }






// netlify/functions/index.js
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ""
    };
  }

  try {
    const productId = event.queryStringParameters?.id;

    // Health check
    if (!productId) {
      return {
        statusCode: 200,
        headers: { ...corsHeaders, "Content-Type": "text/html" },
        body: "<html><body>Giftalaxy Backend Running</body></html>"
      };
    }

    // Check env variables
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return {
        statusCode: 200,
        headers: { ...corsHeaders, "Content-Type": "text/html" },
        body: "<html><body>Service not configured</body></html>"
      };
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: product, error } = await supabase
      .from("products")
      .select("name, about, product_image")
      .eq("id", productId)
      .single();

    if (error || !product) {
      return {
        statusCode: 200,
        headers: { ...corsHeaders, "Content-Type": "text/html" },
        body: "<html><body>Product not found</body></html>"
      };
    }

    let imageUrl = "";
    if (product.product_image) {
      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(product.product_image);
      imageUrl = data?.publicUrl || "";
    }

    const url = `https:/gift-shop-new.netlify.app/product/${productId}`;//https://giftalaxy.com/product/564ce3a4-4511-4365-9033-c826ade140b8

     const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta property="og:title" content="${product.name}" />
<meta property="og:description" content="${product.about || "Gift from Gift shop "}" />
<meta property="og:image" content="${imageUrl}" />
<meta property="og:url" content="${url}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
</head>
<body>Giftalaxy</body>
</html>`;

 

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "text/html" },
      body: html
    };

  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "text/html" },
      body: "<html><body>Giftalaxy</body></html>"
    };
  }
};
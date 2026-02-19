import { useState } from "react";

export default function ProductPage({ productId }) {
  const [htmlContent, setHtmlContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const fetchPreview = async () => {
    try {
      // Call your Netlify Function
      const res = await fetch(
        `/.netlify/functions/index?id=${productId}`
      );
      const text = await res.text();
      setHtmlContent(text);

      // Optional: extract the OG image from HTML using regex
      const match = text.match(/<meta property="og:image" content="([^"]+)" \/>/);
      if (match && match[1]) setImageUrl(match[1]);
    } catch (err) {
      console.error("Error fetching preview:", err);
    }
  };

  return (
    <div className="p-4">
      <h1>Product Preview Test</h1>
      <button
        onClick={fetchPreview}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Fetch Preview
      </button>

      {imageUrl && (
        <div className="mt-4">
          <h2>OG Image:</h2>
          <img src={imageUrl} alt="OG preview" className="max-w-xs" />
        </div>
      )}

      {htmlContent && (
        <div className="mt-4">
          <h2>Raw HTML Response:</h2>
          <pre className="bg-gray-100 p-2 overflow-auto max-h-96">
            {htmlContent}
          </pre>
        </div>
      )}
    </div>
  );
}
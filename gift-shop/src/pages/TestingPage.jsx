import { useState } from "react";
import { supabase } from "../supabaseClient"

 export default function TestingPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    const [status, setStatus] = useState("")
  

    const checkEnv = () => {
    const keys = [
      //  import.meta.env.VITE_SUPABASE_URL,
      //  import.meta.env.VITE_SUPABASE_ANON_KEY,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      // process.env.SUPABASE_SERVICE_ROLE_KEY
    ]

    const allExist = keys.every(key => !!key)

    if (allExist) {
      alert("✅ All ENV keys exist")
    } else {
      alert("❌ Some ENV keys are missing")
    }
  }

    




  


  const testEnv = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/.netlify/functions/index");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>🔍 Netlify Environment Test</h1>

      <button
        onClick={testEnv}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Test Environment Variables
      </button>

      {loading && <p>Checking...</p>}

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {result && (
        <pre style={{ marginTop: 20 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}


         <button onClick={checkEnv}>
      Check ENV Keys
    </button>
    </div>



  );
}

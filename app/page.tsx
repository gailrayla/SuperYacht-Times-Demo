"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CLIENT_ID = "MsdFcFDwweoUf5XgIKIApO6VZgkQ6omLujLV7f3zM5o";
const REDIRECT_URI = "http://localhost:3000";
const OAUTH_PARAMS = {
  tokenEndpoint: "https://www.superyachttimes.com/oauth/token",
};

const HomePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("OAuth2Callback useEffect triggered on /");

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get("code");

      if (authCode) {
        const codeVerifier = localStorage.getItem("code_verifier");

        if (!codeVerifier) {
          setError("Code verifier not found.");
          setLoading(false);
          return;
        }

        fetchAccessToken(authCode, codeVerifier);
      } else {
        setError("Authorization code not found.");
        setLoading(false);
      }
    }
  }, []);

  const fetchAccessToken = async (code: string, codeVerifier: string) => {
    try {
      const response = await fetch(OAUTH_PARAMS.tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          code_verifier: codeVerifier,
          grant_type: "authorization_code",
        }),
      });

      if (!response.ok) {
        throw new Error("Token exchange failed");
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);

      // Redirect after successful login
      router.push("/search");
    } catch (err) {
      setError("Failed to exchange token.");
      console.error("OAuth error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-6 rounded shadow">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p>Login successful. Redirecting...</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;

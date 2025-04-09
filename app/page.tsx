"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI!;
const OAUTH_PARAMS = {
  tokenEndpoint: process.env.NEXT_PUBLIC_OAUTH_TOKEN_ENDPOINT!,
};

const HomePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get("code");

      if (!authCode) {
        router.push("/login");
      } else {
        console.log("OAuth2Callback useEffect triggered on /");
        const codeVerifier = localStorage.getItem("code_verifier");

        if (!codeVerifier) {
          setError("Code verifier not found.");
          setLoading(false);
          return;
        }

        fetchAccessToken(authCode, codeVerifier);
      }
    }
  }, [router]);

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

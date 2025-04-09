"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Using next/navigation for routing

const CLIENT_ID = "MsdFcFDwweoUf5XgIKIApO6VZgkQ6omLujLV7f3zM5o";
const REDIRECT_URI = "http://localhost:3000"; // Ensure this matches the registered redirect URI
const OAUTH_PARAMS = {
  tokenEndpoint: "https://www.superyachttimes.com/oauth/token",
};

const OAuth2Callback = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("OAuth2Callback useEffect triggered");

    // Check if we're running in the client-side environment
    if (typeof window !== "undefined") {
      console.log("Running in the browser environment");

      // Extract query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get("code");

      console.log("Received Authorization Code:", authCode);

      if (authCode) {
        const codeVerifier = localStorage.getItem("code_verifier");
        console.log("Retrieved codeVerifier from localStorage:", codeVerifier);

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
    } else {
      console.error(
        "Window is not defined, running in server-side environment"
      );
    }
  }, []);

  const fetchAccessToken = async (code: string, codeVerifier: string) => {
    try {
      console.log("Exchanging authorization code for access token...");

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
        throw new Error("Failed to exchange code for token");
      }

      const data = await response.json();
      console.log("Received access token:", data.access_token);

      // Store the access token
      localStorage.setItem("access_token", data.access_token);

      // Redirect after successful login
      router.push("/search");
    } catch (error) {
      setError("An error occurred during token exchange.");
      console.error("Error during token exchange:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p>Login successful! Redirecting...</p>
        )}
      </div>
    </div>
  );
};

export default OAuth2Callback;

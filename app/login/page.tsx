"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { generatePKCE } from "../lib/utils/pkceUtils";

const CLIENT_ID = "MsdFcFDwweoUf5XgIKIApO6VZgkQ6omLujLV7f3zM5o";
const REDIRECT_URI = "http://localhost:3000"; // Must match the registered redirect URI exactly
const OAUTH_PARAMS = {
  authorizationEndpoint: "https://www.superyachttimes.com/oauth/authorize",
  scopes: ["API"],
};

const LoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Running in the browser environment");

      const initiateLogin = async () => {
        try {
          console.log("Starting OAuth2 login flow");

          // Generate PKCE code verifier and challenge
          const { codeVerifier, codeChallenge } = await generatePKCE();
          console.log("Generated codeVerifier:", codeVerifier);
          console.log("Generated codeChallenge:", codeChallenge);

          // Store the codeVerifier in localStorage
          localStorage.setItem("code_verifier", codeVerifier);
          console.log("Stored codeVerifier in localStorage");

          // Construct the authorization URL using the properly encoded constant
          const authUrl = `${
            OAUTH_PARAMS.authorizationEndpoint
          }?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
            REDIRECT_URI
          )}&response_type=code&scope=${OAUTH_PARAMS.scopes.join(
            " "
          )}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

          console.log("Authorization URL:", authUrl);

          // Redirect to the authorization URL
          window.location.href = authUrl;
        } catch (error) {
          console.error("Error during PKCE generation or OAuth flow:", error);
        }
      };

      initiateLogin();
    } else {
      console.error(
        "Window is not defined, running in server-side environment"
      );
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-semibold text-center mb-4">Login</h1>
        <p className="text-center mb-6">Redirecting to login...</p>
      </div>
    </div>
  );
};

export default LoginPage;

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { generatePKCE } from "../lib/utils/pkceUtils";

const CLIENT_ID = "MsdFcFDwweoUf5XgIKIApO6VZgkQ6omLujLV7f3zM5o";
const REDIRECT_URI = "http://localhost:3000/oauth2/callback"; // Ensure this matches the redirect URI in OAuth settings
const OAUTH_PARAMS = {
  authorizationEndpoint: "https://www.superyachttimes.com/oauth/authorize",
  scopes: ["API"],
};

const LoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    const initiateLogin = async () => {
      try {
        // Generate PKCE code verifier and challenge
        const { codeVerifier, codeChallenge } = await generatePKCE();
        console.log("Generated codeVerifier:", codeVerifier);
        console.log("Generated codeChallenge:", codeChallenge);

        // Store the codeVerifier in localStorage
        localStorage.setItem("code_verifier", codeVerifier);
        console.log("Stored codeVerifier in localStorage");

        const encodedRedirectUri = encodeURIComponent(REDIRECT_URI);
        console.log("Encoded Redirect URI:", encodedRedirectUri);

        // Construct the authorization URL
        const authUrl = `${
          OAUTH_PARAMS.authorizationEndpoint
        }?client_id=${CLIENT_ID}&redirect_uri=${encodedRedirectUri}&response_type=code&scope=${OAUTH_PARAMS.scopes.join(
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

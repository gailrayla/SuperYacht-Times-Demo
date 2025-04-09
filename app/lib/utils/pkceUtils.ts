export async function generatePKCE() {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await base64URLEncode(await sha256(codeVerifier));
  return { codeVerifier, codeChallenge };
}

// Helper to generate a random string
function generateRandomString(length: number) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

// Helper to base64-url encode
async function base64URLEncode(str: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Helper to hash with SHA-256
async function sha256(message: string) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  return hashBuffer;
}

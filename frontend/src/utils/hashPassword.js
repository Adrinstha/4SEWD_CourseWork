export async function hashPassword(password) {
  if (
    typeof crypto !== "undefined" &&
    crypto.subtle &&
    typeof crypto.subtle.digest === "function"
  ) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Fallback for non-subtle environments
  let hash1 = 5381;
  let hash2 = 1777;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash1 = (hash1 << 5) + hash1 + char;
    hash2 = (hash2 << 5) - hash2 + char;
  }
  return (hash1 >>> 0).toString(16) + (hash2 >>> 0).toString(16);
}

export default hashPassword;

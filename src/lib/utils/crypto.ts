// Utility function to hash a passphrase using SHA-256
export async function hashPassphrase(passphrase: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(passphrase);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Format: HASH:::MESSAGE
export function embedHashInMessage(hash: string, message: string): string {
  return `${hash}:::${message}`;
}

export function extractHashFromMessage(embeddedMessage: string): { hash: string; message: string } | null {
  const parts = embeddedMessage.split(':::');
  if (parts.length < 2) {
    return null;
  }
  const hash = parts[0];
  const message = parts.slice(1).join(':::'); // In case message contains :::
  return { hash, message };
}

import crypto from "crypto";

export function hashSender(sender: string): string {
  const salt = process.env.SENDER_HASH_SALT;
  if (!salt) throw new Error("Missing SENDER_HASH_SALT");

  return crypto.createHash("sha256").update(`${salt}:${sender}`).digest("hex");
}

export function orderShortId(id: string): string {
  return id.split("-")[0].toUpperCase();
}

import twilio from "twilio";

export function verifyTwilioSignature({
  authToken,
  signature,
  url,
  params
}: {
  authToken: string;
  signature: string;
  url: string;
  params: Record<string, string>;
}): boolean {
  return twilio.validateRequest(authToken, signature, url, params);
}

export function twimlMessage(message: string): string {
  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(message);
  return twiml.toString();
}

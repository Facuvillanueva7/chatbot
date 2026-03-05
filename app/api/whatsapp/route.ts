import { NextRequest, NextResponse } from "next/server";
import { extractOrder } from "@/lib/extract-order";
import { hashSender, orderShortId } from "@/lib/privacy";
import { supabase } from "@/lib/supabase";
import { twimlMessage, verifyTwilioSignature } from "@/lib/twilio";

export async function POST(request: NextRequest) {
  const formRaw = await request.text();
  const params = new URLSearchParams(formRaw);

  const from = params.get("From") ?? "unknown";
  const body = params.get("Body")?.trim() ?? "";

  if (!body) {
    return new NextResponse(twimlMessage("Please send an order message."), {
      headers: { "Content-Type": "text/xml" }
    });
  }

  const signature = request.headers.get("x-twilio-signature");
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const baseUrl = process.env.PUBLIC_WEBHOOK_BASE_URL;

  if (!signature || !twilioAuthToken) {
    return NextResponse.json({ error: "Missing Twilio signature support." }, { status: 401 });
  }

  const urlToCheck = baseUrl ? `${baseUrl}/api/whatsapp` : request.url;
  const isValid = verifyTwilioSignature({
    authToken: twilioAuthToken,
    signature,
    url: urlToCheck,
    params: Object.fromEntries(params.entries())
  });

  if (!isValid) {
    return NextResponse.json({ error: "Invalid Twilio signature" }, { status: 401 });
  }

  const parsed = await extractOrder(body);
  const senderHash = hashSender(from);

  const insert = await supabase
    .from("orders")
    .insert({
      channel: "whatsapp",
      sender: senderHash,
      original_message: body,
      parsed_json: parsed,
      confidence: parsed.confidence_score,
      items: parsed.items,
      fulfillment: parsed.fulfillment,
      address: parsed.address,
      requested_time: parsed.requested_time,
      payment_method: parsed.payment_method,
      status: "new"
    })
    .select("id")
    .single();

  if (insert.error) {
    console.error(insert.error);
    return new NextResponse(twimlMessage("Sorry, we could not process your order. Please try again."), {
      headers: { "Content-Type": "text/xml" },
      status: 500
    });
  }

  const orderNumber = orderShortId(insert.data.id);
  return new NextResponse(twimlMessage(`Got it. Your order was received. Order #${orderNumber}.`), {
    headers: { "Content-Type": "text/xml" }
  });
}

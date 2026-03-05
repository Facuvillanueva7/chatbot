import OpenAI from "openai";
import { ParsedOrder } from "@/lib/types";

const jsonSchema = {
  name: "order_extraction",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      customer_name: { type: ["string", "null"] },
      items: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            quantity: { type: "number" },
            notes: { type: ["string", "null"] }
          },
          required: ["name", "quantity", "notes"]
        }
      },
      fulfillment: {
        anyOf: [{ enum: ["delivery", "pickup"] }, { type: "null" }]
      },
      address: { type: ["string", "null"] },
      requested_time: { type: ["string", "null"] },
      payment_method: { type: ["string", "null"] },
      confidence_score: { type: "number", minimum: 0, maximum: 1 }
    },
    required: [
      "customer_name",
      "items",
      "fulfillment",
      "address",
      "requested_time",
      "payment_method",
      "confidence_score"
    ]
  },
  strict: true
} as const;

export async function extractOrder(message: string): Promise<ParsedOrder> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const client = new OpenAI({ apiKey });

  const completion = await client.chat.completions.create({
    model,
    response_format: {
      type: "json_schema",
      json_schema: jsonSchema
    },
    messages: [
      {
        role: "system",
        content:
          "Extract order details from the user message. Return JSON only. If data is missing, use null. Do not invent items. confidence_score must reflect certainty from 0 to 1."
      },
      {
        role: "user",
        content: message
      }
    ]
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("Model returned empty response");
  }

  return JSON.parse(raw) as ParsedOrder;
}

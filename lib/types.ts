export type ParsedItem = {
  name: string;
  quantity: number;
  notes: string | null;
};

export type ParsedOrder = {
  customer_name: string | null;
  items: ParsedItem[];
  fulfillment: "delivery" | "pickup" | null;
  address: string | null;
  requested_time: string | null;
  payment_method: string | null;
  confidence_score: number;
};

export type OrderRecord = {
  id: string;
  created_at: string;
  channel: string;
  sender: string;
  original_message: string;
  parsed_json: ParsedOrder;
  status: string;
  confidence: number | null;
  items: ParsedItem[];
  fulfillment: string | null;
  address: string | null;
  requested_time: string | null;
  payment_method: string | null;
};

import { supabase } from "@/lib/supabase";
import { OrderRecord } from "@/lib/types";

export async function getRecentOrders(limit = 50): Promise<OrderRecord[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as OrderRecord[];
}

export async function getOrderById(id: string): Promise<OrderRecord | null> {
  const { data, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();

  if (error) throw error;
  return data as OrderRecord | null;
}

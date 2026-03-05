import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/orders";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id);
  if (!order) notFound();

  return (
    <div className="card">
      <p>
        <Link href="/orders">← Back to orders</Link>
      </p>
      <h1>Order {order.id}</h1>
      <p>
        <strong>Created:</strong> {new Date(order.created_at).toLocaleString()}
      </p>
      <p>
        <strong>Sender hash:</strong> {order.sender}
      </p>
      <p>
        <strong>Fulfillment:</strong> {order.fulfillment ?? "-"}
      </p>
      <p>
        <strong>Address:</strong> {order.address ?? "-"}
      </p>
      <p>
        <strong>Requested time:</strong> {order.requested_time ?? "-"}
      </p>
      <p>
        <strong>Payment:</strong> {order.payment_method ?? "-"}
      </p>
      <p>
        <strong>Confidence:</strong> {order.confidence ?? "-"}
      </p>

      <h2>Items</h2>
      <pre>{JSON.stringify(order.items, null, 2)}</pre>

      <h2>Original message</h2>
      <pre>{order.original_message}</pre>

      <h2>Parsed JSON</h2>
      <pre>{JSON.stringify(order.parsed_json, null, 2)}</pre>
    </div>
  );
}

import Link from "next/link";
import { getRecentOrders } from "@/lib/orders";

export default async function OrdersPage() {
  const orders = await getRecentOrders();

  return (
    <div className="card">
      <h1>Recent Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Created</th>
            <th>Order ID</th>
            <th>Channel</th>
            <th>Fulfillment</th>
            <th>Confidence</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{new Date(order.created_at).toLocaleString()}</td>
              <td>
                <Link href={`/orders/${order.id}`}>{order.id.slice(0, 8)}</Link>
              </td>
              <td>{order.channel}</td>
              <td>{order.fulfillment ?? "-"}</td>
              <td>{order.confidence ?? "-"}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

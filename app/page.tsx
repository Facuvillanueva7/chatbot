import Link from "next/link";

export default function Home() {
  return (
    <div className="card">
      <h1>WhatsApp Orders MVP</h1>
      <p>This service receives orders over WhatsApp and saves parsed data to Postgres.</p>
      <p>
        Open <Link href="/orders">/orders</Link> to view recent orders.
      </p>
    </div>
  );
}

import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-6">📊 Dashboard</h1>
      <p className="text-lg text-gray-700 mb-6">
        Welcome to your Network Sadhguru Practice Dashboard!
      </p>

      <Link
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition"
      >
        ⬅ Back to Home
      </Link>
    </div>
  );
}

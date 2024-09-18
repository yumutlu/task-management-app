import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Task Management App</h1>
      <p className="mb-4">Welcome to your task management application.</p>
      <Link href="/dashboard" className="text-blue-500 hover:text-blue-700">
        Go to Dashboard
      </Link>
    </div>
  );
}
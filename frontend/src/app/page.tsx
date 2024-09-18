import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Task Management App</h1>
      <p className="mb-4">Welcome to your task management application.</p>
      <div className="space-x-4">
        <Link href="/dashboard" className="text-blue-500 hover:text-blue-700">
          Go to Dashboard
        </Link>
        <Link href="/tasks" className="text-blue-500 hover:text-blue-700">
          View Tasks
        </Link>
      </div>
    </div>
  );
}
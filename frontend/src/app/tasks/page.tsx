'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTasks, deleteTask } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

interface Task {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    dueDate: string;
}

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getTasks();
            setTasks(response.data);
        } catch (err) {
            setError('Failed to fetch tasks. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTask = async (id: string) => {
        try {
            await deleteTask(id);
            setTasks(tasks.filter(task => task.id !== id));
        } catch (err) {
            setError('Failed to delete task. Please try again later.');
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Task List</h1>
            <Link href="/tasks/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
                Add New Task
            </Link>
            <div className="mt-6">
                {tasks.map((task) => (
                    <div key={task.id} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                        <div className="mb-4">
                            <Link href={`/tasks/${task.id}`} className="text-xl font-bold hover:text-blue-500">
                                {task.title}
                            </Link>
                            <p className="text-gray-700 text-base">{task.description}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'}`}>
                                {task.status}
                            </span>
                            <span className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Link href={`/tasks/${task.id}/edit`} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2">
                                Edit
                            </Link>
                            <button onClick={() => handleDeleteTask(task.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskList;
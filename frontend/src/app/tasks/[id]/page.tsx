'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    status: 'pending' | 'in-progress' | 'completed';
}

export default function TaskDetail({ params }: { params: { id: string } }) {
    const [task, setTask] = useState<Task | null>(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axios.get<Task>(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${params.id}`);
                setTask(response.data);
            } catch (error) {
                console.error('Error fetching task:', error);
            }
        };

        fetchTask();
    }, [params.id]);

    if (!task) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Task Details</h1>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <h2 className="text-xl font-bold">{task.title}</h2>
                </div>
                <div className="mb-4">
                    <p className="text-gray-700">{task.description}</p>
                </div>
                <div className="mb-4">
                    <span className="font-bold">Due Date:</span> {new Date(task.dueDate).toLocaleDateString()}
                </div>
                <div className="mb-4">
                    <span className="font-bold">Status:</span>
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'}`}>
                        {task.status}
                    </span>
                </div>
            </div>
            <div className="flex justify-between">
                <Link href="/tasks" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Back to Task List
                </Link>
                <Link href={`/tasks/${task.id}/edit`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Edit Task
                </Link>
            </div>
        </div>
    );
}
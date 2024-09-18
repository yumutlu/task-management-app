'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTaskContext } from '@/context/TaskContext';
import { getTask, deleteTask } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function TaskDetail({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { state, dispatch } = useTaskContext();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTask = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getTask(params.id);
                dispatch({ type: 'UPDATE_TASK', payload: response.data });
            } catch (err) {
                setError('Could not get task details. Please try again later..');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTask();
    }, [params.id, dispatch]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(params.id);
                dispatch({ type: 'DELETE_TASK', payload: params.id });
                router.push('/tasks');
            } catch (err) {
                setError('The task could not be deleted. Please try again later..');
            }
        }
    };

    const task = state.tasks.find(t => t.id === params.id);

    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (!task) return <ErrorMessage message="Task not found" />;

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
                        {task.status === 'completed' ? 'Tamamlandı' :
                            task.status === 'in-progress' ? 'Devam Ediyor' : 'Beklemede'}
                    </span>
                </div>
            </div>
            <div className="flex justify-between">
                <Link href="/tasks" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Back to Task List
                </Link>
                <div>
                    <Link href={`/tasks/${task.id}/edit`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                        Edit Task
                    </Link>
                    <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Delete Task
                    </button>
                </div>
            </div>
        </div>
    );
}
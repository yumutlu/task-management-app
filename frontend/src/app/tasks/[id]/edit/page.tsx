'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTask, updateTask } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { useTaskContext } from '@/context/TaskContext';

interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    status: 'pending' | 'in-progress' | 'completed';
}

export default function EditTask({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { state, dispatch } = useTaskContext();
    const [task, setTask] = useState({
        id: '',
        title: '',
        description: '',
        dueDate: '',
        status: 'pending' as 'pending' | 'in-progress' | 'completed'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTask = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getTask(params.id);
                setTask(response.data);
            } catch (err) {
                setError('Failed to fetch task details. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTask();
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTask(prevTask => ({
            ...prevTask,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const response = await updateTask(task.id, task);
            const updatedTask: Task = response.data;
            dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
            router.push('/tasks');
        } catch (err) {
            setError('Failed to update task. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Edit Task</h1>
            <form onSubmit={handleSubmit} className="max-w-md">
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={task.title}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={task.description}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows={3}
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label htmlFor="dueDate" className="block text-gray-700 text-sm font-bold mb-2">
                        Due Date
                    </label>
                    <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={task.dueDate.split('T')[0]}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={task.status}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Updating...' : 'Update Task'}
                    </button>
                </div>
            </form>
        </div>
    );
}
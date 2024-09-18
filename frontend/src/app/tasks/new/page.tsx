'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTask } from '@/services/api';
import ErrorMessage from '@/components/ErrorMessage';

const AddTask: React.FC = () => {
    const router = useRouter();
    const [task, setTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        status: 'pending'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            await createTask(task);
            router.push('/tasks');
        } catch (err) {
            setError('Failed to create task. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Add New Task</h1>
            {error && <ErrorMessage message={error} />}
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
                        value={task.dueDate}
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
                        {isLoading ? 'Adding...' : 'Add Task'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTask;
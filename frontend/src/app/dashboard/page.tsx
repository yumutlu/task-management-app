'use client';
import React, { useEffect, useState } from 'react';
import { getTaskSummary } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TaskSummary {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    upcomingTasks: Array<{
        id: string;
        title: string;
        dueDate: string;
    }>;
}

const Dashboard: React.FC = () => {
    const [summary, setSummary] = useState<TaskSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getTaskSummary();
                setSummary(response.data);
            } catch (err) {
                setError('Failed to fetch task summary. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (!summary) return <ErrorMessage message="No data available" />;

    const chartData = [
        { name: 'Completed', value: summary.completedTasks },
        { name: 'Pending', value: summary.pendingTasks },
        { name: 'In Progress', value: summary.inProgressTasks },
    ];
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Task Management Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Task Statistics</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Upcoming Tasks</h2>
                    <ul className="space-y-2">
                        {summary.upcomingTasks.map((task) => (
                            <li key={task.id} className="flex justify-between items-center">
                                <span>{task.title}</span>
                                <span className="text-sm text-gray-500">{new Date(task.dueDate).toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
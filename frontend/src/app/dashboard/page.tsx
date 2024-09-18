'use client';
import React, { useEffect, useState } from 'react';
import { getTaskSummary } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './Dashboard.module.css';

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
        <div className={styles.container}>
            <h1 className={styles.title}>Dashboard</h1>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h2 className={styles.statTitle}>Total Tasks</h2>
                    <p className={styles.statValue}>{summary.totalTasks}</p>
                </div>
                <div className={styles.statCard}>
                    <h2 className={styles.statTitle}>Completed Tasks</h2>
                    <p className={styles.statValue}>{summary.completedTasks}</p>
                </div>
                <div className={styles.statCard}>
                    <h2 className={styles.statTitle}>Pending Tasks</h2>
                    <p className={styles.statValue}>{summary.pendingTasks}</p>
                </div>
                <div className={styles.statCard}>
                    <h2 className={styles.statTitle}>In Progress Tasks</h2>
                    <p className={styles.statValue}>{summary.inProgressTasks}</p>
                </div>
            </div>
            <div className={styles.recentTasksList}>
                <h2 className={styles.recentTasksTitle}>Recent Tasks</h2>
                {summary.upcomingTasks.map((task) => (
                    <div key={task.id} className={styles.taskItem}>
                        <h3 className={styles.taskTitle}>{task.title}</h3>
                        <p className={styles.taskMeta}>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
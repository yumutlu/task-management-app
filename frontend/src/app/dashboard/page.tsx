'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTaskContext } from '@/context/TaskContext';
import { getSummary } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import styles from './Dashboard.module.css';

interface Summary {
    totalTasks: number;
    completedTasks: number;
    upcomingTasks: Array<{
        id: string;
        title: string;
        dueDate: string;
    }>;
}

export default function Dashboard() {
    const { state } = useTaskContext();
    const [summary, setSummary] = useState<Summary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getSummary();
                setSummary(response.data);
            } catch (err) {
                setError('Failed to fetch summary. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (!summary) return null;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Dashboard</h1>
            <div className={styles.summaryCards}>
                <div className={styles.card}>
                    <h2>Total Tasks</h2>
                    <p>{summary.totalTasks}</p>
                </div>
                <div className={styles.card}>
                    <h2>Completed Tasks</h2>
                    <p>{summary.completedTasks}</p>
                </div>
            </div>
            <div className={styles.recentTasksList}>
                <h2 className={styles.recentTasksTitle}>Recent Tasks</h2>
                {summary.upcomingTasks && summary.upcomingTasks.length > 0 ? (
                    summary.upcomingTasks.map((task) => (
                        <Link href={`/tasks/${task.id}`} key={task.id} className={styles.taskLink}>
                            <div className={styles.taskItem}>
                                <span className={styles.taskTitle}>{task.title}</span>
                                <span className={styles.taskDueDate}>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>No upcoming tasks</p>
                )}
            </div>
        </div>
    );
}
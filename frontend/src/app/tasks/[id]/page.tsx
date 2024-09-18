'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTaskContext } from '@/context/TaskContext';
import { getTask, deleteTask } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import styles from './TaskDetail.module.css';

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
        <div className={styles.container}>
            <h1 className={styles.title}>{task.title}</h1>
            <div className={styles.taskMeta}>
                <span className={`${styles.taskStatus} ${styles[task.status]}`}>
                    {task.status}
                </span>
                <span className={styles.taskDueDate}>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
            <p className={styles.taskDescription}>{task.description}</p>
            <div className={styles.actionButtons}>
                <Link href={`/tasks/${task.id}/edit`} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                    Edit
                </Link>
                <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Delete
                </button>
            </div>
        </div>
    );
}
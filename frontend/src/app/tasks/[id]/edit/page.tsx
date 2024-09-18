'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTask, updateTask } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { useTaskContext } from '@/context/TaskContext';
import styles from './TaskForm.module.css';
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
        <div className={styles.container}>
            <h1 className={styles.title}>Edit Task</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="title" className={styles.label}>Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={task.title}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="description" className={styles.label}>Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={task.description}
                        onChange={handleChange}
                        className={styles.textarea}
                        rows={3}
                    ></textarea>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="dueDate" className={styles.label}>Due Date</label>
                    <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={task.dueDate.split('T')[0]}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="status" className={styles.label}>Status</label>
                    <select
                        id="status"
                        name="status"
                        value={task.status}
                        onChange={handleChange}
                        className={styles.select}
                    >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Updating...' : 'Update Task'}
                    </button>
                </div>
            </form>
        </div>
    );
}
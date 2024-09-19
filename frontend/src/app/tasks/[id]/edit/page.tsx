'use client';
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useTaskContext } from '@/context/TaskContext';
import { useRouter } from 'next/navigation';
import { getTask, updateTask } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import styles from './EditTask.module.css';

interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    dueDate: string;
}

interface EditTaskProps {
    params: { id: string };
}

const EditTask: React.FC<EditTaskProps> = ({ params }) => {
    const router = useRouter();
    const { dispatch } = useTaskContext();
    const [task, setTask] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await getTask(params.id);
                setTask(response.data);
            } catch (err) {
                setError('Failed to fetch task details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTask();
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!task) return;

        try {
            const response = await updateTask(task.id, task);
            const updatedTask = response.data;
            dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
            router.push('/tasks');
        } catch (err) {
            setError('Failed to update task');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTask((prevTask: any) => prevTask ? { ...prevTask, [name]: value } : null);
    };

    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (!task) return <ErrorMessage message="Task not found" />;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Edit Task</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={task.title}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={task.description}
                        onChange={handleChange}
                        className={styles.textarea}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="status">Status</label>
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
                    <label htmlFor="dueDate">Due Date</label>
                    <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={task.dueDate.split('T')[0]}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </div>
                <button type="submit" className="btn btn-blue">Update Task</button>
            </form>
        </div>
    );
};

const ProtectedEditTask: React.FC<EditTaskProps> = (props) => (
    <ProtectedRoute>
        <EditTask {...props} />
    </ProtectedRoute>
);

export default ProtectedEditTask;
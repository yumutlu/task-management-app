'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTaskContext } from '@/context/TaskContext';
import { createTask } from '@/services/api';
import ErrorMessage from '@/components/ErrorMessage';
import styles from '../../tasks/[id]/edit/TaskForm.module.css';

const AddTask: React.FC = () => {


    const router = useRouter();
    const { dispatch } = useTaskContext();
    const [task, setTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        status: 'pending' as 'pending' | 'in-progress' | 'completed'
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
            const response = await createTask(task);
            const newTask = {
                id: response.data.id,
                title: response.data.title,
                description: response.data.description,
                dueDate: response.data.dueDate,
                status: response.data.status
            };
            dispatch({ type: 'ADD_TASK', payload: newTask });
            router.push('/tasks');
        } catch (err) {
            setError('Failed to create task. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Create New Task</h1>
            {error && <ErrorMessage message={error} />}
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="title" className={styles.label}>Title</label>
                    <input
                        type="text"
                        id="title"
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
                        value={task.dueDate}
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
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Adding...' : 'Create Task'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTask;


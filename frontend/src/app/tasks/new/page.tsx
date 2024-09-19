'use client';
import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useTaskContext } from '@/context/TaskContext';
import { useRouter } from 'next/navigation';
import { createTask } from '@/services/api';
import styles from './NewTask.module.css';

interface Task {
    id: string;
    title: string;
    description: string;
    status: "pending" | "in-progress" | "completed";
    dueDate: string;
}

const NewTask: React.FC = () => {
    const router = useRouter();
    const { dispatch } = useTaskContext();
    const [task, setTask] = useState<Omit<Task, 'id'>>({
        title: '',
        description: '',
        status: 'pending',
        dueDate: ''
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await createTask(task);
            const newTask: Task = {
                id: response.data.id,
                title: response.data.title,
                description: response.data.description,
                status: response.data.status,
                dueDate: response.data.dueDate
            };
            dispatch({ type: 'ADD_TASK', payload: newTask });
            router.push('/tasks');
        } catch (err) {
            console.error('Failed to create task:', err);
            // TODO: Show error message to user
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTask(prevTask => ({ ...prevTask, [name]: value }));
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Create New Task</h1>
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
                        value={task.dueDate}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </div>
                <button type="submit" className="btn btn-blue">Create Task</button>
            </form>
        </div>
    );
};

const ProtectedNewTask: React.FC = () => (
    <ProtectedRoute>
        <NewTask />
    </ProtectedRoute>
);

export default ProtectedNewTask;
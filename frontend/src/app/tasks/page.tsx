'use client';
import React from 'react';
import Link from 'next/link';
import { useTaskContext } from '@/context/TaskContext';
import { deleteTask } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import styles from './TaskList.module.css';
const TaskList: React.FC = () => {
    const { state, dispatch } = useTaskContext();
    const { tasks, isLoading, error } = state;

    const handleDeleteTask = async (id: string) => {
        try {
            await deleteTask(id);
            dispatch({ type: 'DELETE_TASK', payload: id });
        } catch (err) {
            console.error('Failed to delete task:', err);
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Task List</h1>
            <Link href="/tasks/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
                Add New Task
            </Link>
            <div className={styles.taskList}>
                {tasks.map((task) => (
                    <div key={task.id} className={styles.taskItem}>
                        <div className="mb-4">
                            <Link href={`/tasks/${task.id}`} className={styles.taskTitle}>
                                {task.title}
                            </Link>
                            <p className={styles.taskDescription}>{task.description}</p>
                        </div>
                        <div className={styles.taskMeta}>
                            <span className={`${styles.taskStatus} ${styles[task.status]}`}>
                                {task.status}
                            </span>
                            <span className={styles.taskDueDate}>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className={styles.taskActions}>
                            <Link href={`/tasks/${task.id}/edit`} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2">
                                Edit
                            </Link>
                            <button onClick={() => handleDeleteTask(task.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskList;
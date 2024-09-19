'use client';
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useTaskContext } from '@/context/TaskContext';
import { deleteTask } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import Link from 'next/link';
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
            <Link href="/tasks/new" className="btn btn-blue mb-4">
                Add New Task
            </Link>
            <div className={styles.taskList}>
                {tasks.map((task) => (
                    <div key={task.id} className={styles.taskItem}>
                        <h2 className={styles.taskTitle}>{task.title}</h2>
                        <p className={styles.taskDescription}>{task.description}</p>
                        <div className={styles.taskMeta}>
                            <span className={`${styles.taskStatus} ${styles[task.status]}`}>
                                {task.status}
                            </span>
                            <span className={styles.taskDueDate}>
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                        </div>
                        <div className={styles.taskActions}>
                            <Link href={`/tasks/${task.id}/edit`} className="btn btn-blue mr-2">
                                Edit
                            </Link>
                            <button onClick={() => handleDeleteTask(task.id)} className="btn btn-red">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProtectedTaskList: React.FC = () => (
    <ProtectedRoute>
        <TaskList />
    </ProtectedRoute>
);

export default ProtectedTaskList;
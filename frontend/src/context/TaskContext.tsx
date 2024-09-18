import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '@/services/api';

interface Task {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    dueDate: string;
}

interface TaskState {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
}

type TaskAction =
    | { type: 'FETCH_TASKS_START' }
    | { type: 'FETCH_TASKS_SUCCESS'; payload: Task[] }
    | { type: 'FETCH_TASKS_ERROR'; payload: string }
    | { type: 'ADD_TASK'; payload: Task }
    | { type: 'UPDATE_TASK'; payload: Task }
    | { type: 'DELETE_TASK'; payload: string };

const TaskContext = createContext<{
    state: TaskState;
    dispatch: React.Dispatch<TaskAction>;
} | undefined>(undefined);

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
    switch (action.type) {
        case 'FETCH_TASKS_START':
            return { ...state, isLoading: true, error: null };
        case 'FETCH_TASKS_SUCCESS':
            return { ...state, isLoading: false, tasks: action.payload };
        case 'FETCH_TASKS_ERROR':
            return { ...state, isLoading: false, error: action.payload };
        case 'ADD_TASK':
            return { ...state, tasks: [...state.tasks, action.payload] };
        case 'UPDATE_TASK':
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task.id === action.payload.id ? action.payload : task
                ),
            };
        case 'DELETE_TASK':
            return {
                ...state,
                tasks: state.tasks.filter((task) => task.id !== action.payload),
            };
        default:
            return state;
    }
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(taskReducer, {
        tasks: [],
        isLoading: false,
        error: null,
    });

    useEffect(() => {
        const fetchTasks = async () => {
            dispatch({ type: 'FETCH_TASKS_START' });
            try {
                const response = await getTasks();
                dispatch({ type: 'FETCH_TASKS_SUCCESS', payload: response.data });
            } catch (error) {
                dispatch({
                    type: 'FETCH_TASKS_ERROR',
                    payload: 'Failed to fetch tasks. Please try again later.',
                });
            }
        };

        fetchTasks();
    }, []);

    return (
        <TaskContext.Provider value={{ state, dispatch }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskContext = () => {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
};
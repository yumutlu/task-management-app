import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, register } from '@/services/api';

interface AuthContextType {
    user: any | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // TODO: Implement token validation
            setUser({ token });
        }
        setIsLoading(false);
    }, []);

    const loginUser = async (username: string, password: string) => {
        try {
            const response = await login({ username, password });
            localStorage.setItem('token', response.data.access_token);
            setUser({ token: response.data.access_token });
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const registerUser = async (username: string, password: string) => {
        try {
            await register({ username, password });
            await loginUser(username, password);
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login: loginUser, register: registerUser, logout: logoutUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
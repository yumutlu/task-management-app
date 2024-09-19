'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return user ? <>{children}</> : null;
};

export default ProtectedRoute;
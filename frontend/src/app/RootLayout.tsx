'use client';
import { AuthProvider } from '@/context/AuthContext'
import { TaskProvider } from '@/context/TaskContext'
import Layout from '@/components/Layout'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthProvider>
            <TaskProvider>
                <Layout>{children}</Layout>
            </TaskProvider>
        </AuthProvider>
    )
}

export default RootLayout;

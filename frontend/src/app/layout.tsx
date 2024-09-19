import Layout from '@/components/Layout'
import { AuthProvider } from '@/context/AuthContext'
import { TaskProvider } from '@/context/TaskContext'
import '@/styles/globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Task Management App',
  description: 'A full-stack task management application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <TaskProvider>
            <Layout>{children}</Layout>
          </TaskProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
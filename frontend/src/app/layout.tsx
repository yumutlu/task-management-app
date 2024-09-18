import Layout from '@/components/Layout'
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
        <TaskProvider>
          <Layout>{children}</Layout>
        </TaskProvider>
      </body>
    </html>
  )
}
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import RootLayout from './RootLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Task Management App',
  description: 'A full-stack task management application',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  )
}
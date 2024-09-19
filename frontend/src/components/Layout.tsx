import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './Layout.module.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth();

    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <nav>
                    <ul className={styles.navList}>
                        <li><Link href="/" className={styles.navLink}>Home</Link></li>
                        <li><Link href="/tasks" className={styles.navLink}>Tasks</Link></li>
                        <li><Link href="/dashboard" className={styles.navLink}>Dashboard</Link></li>
                        {user ? (
                            <li><button onClick={logout} className={styles.navLink}>Logout</button></li>
                        ) : (
                            <>
                                <li><Link href="/login" className={styles.navLink}>Login</Link></li>
                                <li><Link href="/register" className={styles.navLink}>Register</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>
            <main className={styles.main}>{children}</main>
            <footer className={styles.footer}>
                <p>&copy; 2023 Task Management App</p>
            </footer>
        </div>
    );
};

export default Layout;
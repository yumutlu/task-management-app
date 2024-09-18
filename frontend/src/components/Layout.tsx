import React from 'react';
import Link from 'next/link';
import styles from './Layout.module.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <nav>
                    <ul className={styles.navList}>
                        <li><Link href="/" className={styles.navLink}>Home</Link></li>
                        <li><Link href="/tasks" className={styles.navLink}>Tasks</Link></li>
                        <li><Link href="/dashboard" className={styles.navLink}>Dashboard</Link></li>
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
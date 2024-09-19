import Link from 'next/link';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to Task Management App</h1>
      <p className={styles.description}>Organize your tasks efficiently and boost your productivity.</p>
      <div className={styles.linkContainer}>
        <Link href="/login" className={styles.link}>
          Login
        </Link>
        <Link href="/register" className={styles.link}>
          Register
        </Link>
        <Link href="/tasks" className={styles.link}>
          View Tasks
        </Link>
        <Link href="/dashboard" className={styles.link}>
          Dashboard
        </Link>
      </div>
    </div>
  );
}
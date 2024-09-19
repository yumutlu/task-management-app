'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './Register.module.css';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await register(username, password);
            router.push('/tasks');
        } catch (error) {
            console.error('Kayıt başarısız:', error);
            setError('Kayıt işlemi başarısız oldu. Lütfen tekrar deneyin.');
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Kayıt Ol</h1>
            {error && <p className={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                    className={styles.input}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>Register</button>
            </form>
        </div>
    );
};

export default Register;
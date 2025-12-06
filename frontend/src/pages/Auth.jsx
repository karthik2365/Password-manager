import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight } from 'lucide-react';
import api from '../api';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const endpoint = isLogin ? 'login/' : 'register/';

        try {
            const res = await api.post(endpoint, { username, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', res.data.username);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || (err.response?.data?.username ? 'Username already exists' : 'Something went wrong');
            setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
        }
    };

    return (
        <div style={styles.container}>
            <motion.div
                layout
                style={styles.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div style={styles.header}>
                    <div style={styles.iconWrapper}>
                        <Lock color="black" size={24} />
                    </div>
                    <h1 style={{ marginBottom: '0.5rem' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                        {isLogin ? 'Enter your credentials to access.' : 'Sign up to start securing your passwords.'}
                    </p>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <User size={18} color="var(--text-secondary)" />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <Lock size={18} color="var(--text-secondary)" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" style={styles.button}>
                        {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight size={18} />
                    </button>
                </form>

                <div style={styles.footer}>
                    <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                    <button onClick={() => { setIsLogin(!isLogin); setError(''); }} style={styles.linkBtn}>
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-color)',
    },
    card: {
        width: '100%',
        maxWidth: '400px',
        background: 'var(--card-bg)',
        padding: '2rem',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    iconWrapper: {
        width: '48px',
        height: '48px',
        background: 'var(--primary)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    inputGroup: {
        background: 'var(--bg-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
    },
    input: {
        background: 'transparent',
        border: 'none',
        color: 'white',
        outline: 'none',
        width: '100%',
        fontSize: '1rem',
    },
    button: {
        background: 'var(--primary)',
        color: 'var(--primary-text)',
        border: 'none',
        padding: '1rem',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        marginTop: '0.5rem',
        transition: 'background 0.2s',
    },
    footer: {
        marginTop: '1.5rem',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
    },
    linkBtn: {
        background: 'transparent',
        border: 'none',
        color: 'var(--primary)',
        fontWeight: '600',
        cursor: 'pointer',
        marginLeft: '0.5rem',
        fontSize: '0.9rem',
    },
    error: {
        background: 'rgba(239, 68, 68, 0.1)',
        color: 'var(--danger)',
        padding: '0.75rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        fontSize: '0.9rem',
        textAlign: 'center',
    }
};

export default Auth;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Copy, Trash2, Eye, EyeOff, Search, LogOut, Globe, User, ExternalLink, Key } from 'lucide-react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [passwords, setPasswords] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Form state
    const [website, setWebsite] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        fetchPasswords();
    }, []);

    const fetchPasswords = async () => {
        try {
            const res = await api.get('entries/');
            setPasswords(res.data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) navigate('/');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/', { replace: true });
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('entries/', { website, username, password, url });
            setShowModal(false);
            setWebsite(''); setUsername(''); setPassword(''); setUrl('');
            fetchPasswords();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this credential?')) return;
        try {
            await api.delete(`entries/${id}/`);
            fetchPasswords();
        } catch (err) {
            console.error(err);
        }
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // You might want to add a toast notification here
    };

    const filtered = passwords.filter(p =>
        p.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.container}>
            <div style={styles.backgroundGlow} />
            <header style={styles.nav}>
                <div style={styles.brand}>
                    <div style={styles.logoIcon}><Key size={20} color="black" /></div>
                    <span>Vault<span style={{ color: 'var(--text-secondary)' }}>Guard</span></span>
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                    <LogOut size={16} /> <span>Sign Out</span>
                </button>
            </header>

            <main style={styles.content}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={styles.headerSection}
                >
                    <h1>My Vault</h1>
                    <div style={styles.controls}>
                        <div style={styles.searchWrapper}>
                            <Search size={18} color="var(--text-secondary)" />
                            <input
                                placeholder="Search passwords..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.searchInput}
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowModal(true)}
                            style={styles.addBtn}
                        >
                            <Plus size={18} /> Add New
                        </motion.button>
                    </div>
                </motion.div>

                <div style={styles.tableCard}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeader}>
                                <th style={styles.th}>Website</th>
                                <th style={styles.th}>Username</th>
                                <th style={styles.th}>Password</th>
                                <th style={styles.th} align="right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filtered.map((item, index) => (
                                    <TableRow
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        onDelete={handleDelete}
                                        onCopy={copyToClipboard}
                                    />
                                ))}
                            </AnimatePresence>
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={styles.emptyState}>
                                        <div style={styles.emptyContent}>
                                            <Search size={48} color="var(--border-color)" />
                                            <p>No passwords found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            <AnimatePresence>
                {showModal && (
                    <Modal onClose={() => setShowModal(false)} onSubmit={handleAdd}>
                        <div style={styles.modalHeader}>
                            <h2>Add Credential</h2>
                            <p style={styles.modalSub}>Store your secure details.</p>
                        </div>
                        <Input icon={<Globe size={18} />} placeholder="Website Name (e.g. Netflix)" value={website} onChange={setWebsite} required autoFocus />
                        <Input icon={<ExternalLink size={18} />} placeholder="URL (Optional)" value={url} onChange={setUrl} />
                        <Input icon={<User size={18} />} placeholder="Username / Email" value={username} onChange={setUsername} required />
                        <Input icon={<Key size={18} />} placeholder="Password" value={password} onChange={setPassword} type="password" required />
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            style={styles.submitBtn}
                        >
                            Save Credential
                        </motion.button>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
};

const TableRow = ({ item, index, onDelete, onCopy }) => {
    const [showPass, setShowPass] = useState(false);

    return (
        <motion.tr
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05 }}
            style={styles.tr}
        >
            <td style={styles.td}>
                <div style={styles.websiteCell}>
                    <div style={styles.favicon}>
                        {item.website[0].toUpperCase()}
                    </div>
                    <div style={styles.websiteInfo}>
                        <span style={styles.websiteName}>{item.website}</span>
                        {item.url && (
                            <a href={item.url.startsWith('http') ? item.url : `https://${item.url}`} target="_blank" rel="noreferrer" style={styles.link}>
                                {new URL(item.url.startsWith('http') ? item.url : `https://${item.url}`).hostname}
                            </a>
                        )}
                    </div>
                </div>
            </td>
            <td style={styles.td}>
                <span style={styles.username}>{item.username}</span>
            </td>
            <td style={styles.td}>
                <div style={styles.passwordCell}>
                    <span style={styles.passwordText}>
                        {showPass ? item.password : '••••••••••••'}
                    </span>
                    <button onClick={() => setShowPass(!showPass)} style={styles.iconBtn} title={showPass ? "Hide" : "Show"}>
                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button onClick={() => onCopy(item.password)} style={styles.iconBtn} title="Copy">
                        <Copy size={14} />
                    </button>
                </div>
            </td>
            <td style={styles.td} align="right">
                <button onClick={() => onDelete(item.id)} style={styles.deleteBtn} title="Delete">
                    <Trash2 size={16} />
                </button>
            </td>
        </motion.tr>
    );
};

const Input = ({ icon, ...props }) => (
    <div style={styles.inputContainer}>
        <div style={styles.inputIcon}>
            {React.cloneElement(icon, { color: 'var(--text-secondary)' })}
        </div>
        <input
            style={styles.input}
            {...props}
            onChange={(e) => props.onChange(e.target.value)}
        />
    </div>
);

const Modal = ({ children, onClose, onSubmit }) => (
    <div style={styles.overlay}>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.backdrop}
            onClick={onClose}
        />
        <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            style={styles.modal}
        >
            <button onClick={onClose} style={styles.closeBtn}>&times;</button>
            <form onSubmit={onSubmit} style={styles.form}>
                {children}
            </form>
        </motion.div>
    </div>
);

const styles = {
    container: {
        minHeight: '100vh',
        background: 'var(--bg-color)',
        paddingBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
    },
    backgroundGlow: {
        position: 'absolute',
        top: '-20%',
        left: '20%',
        width: '60%',
        height: '60%',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0) 70%)',
        zIndex: 0,
        pointerEvents: 'none',
    },
    nav: {
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50,
    },
    brand: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
    },
    logoIcon: {
        background: 'var(--primary)',
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutBtn: {
        background: 'transparent',
        border: '1px solid var(--border-color)',
        color: 'var(--text-secondary)',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.9rem',
        transition: 'all 0.2s',
    },
    content: {
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '0 1.5rem',
        position: 'relative',
        zIndex: 1,
    },
    headerSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    controls: {
        display: 'flex',
        gap: '1rem',
    },
    searchWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '0 0.75rem',
        width: '300px',
    },
    searchInput: {
        background: 'transparent',
        border: 'none',
        padding: '0.65rem 0.5rem',
        color: 'var(--text-primary)',
        width: '100%',
        outline: 'none',
        fontSize: '0.95rem',
    },
    addBtn: {
        background: 'var(--primary)',
        color: 'var(--primary-text)',
        border: 'none',
        padding: '0 1.25rem',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        boxShadow: '0 4px 12px rgba(255, 255, 255, 0.1)',
    },
    tableCard: {
        background: 'var(--card-bg)',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        color: 'var(--text-primary)',
    },
    tableHeader: {
        background: 'var(--bg-color)',
        borderBottom: '1px solid var(--border-color)',
    },
    th: {
        padding: '1rem 1.5rem',
        textAlign: 'left',
        fontWeight: '600',
        color: 'var(--text-secondary)',
        fontSize: '0.85rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    tr: {
        borderBottom: '1px solid var(--border-color)',
        transition: 'background 0.2s',
    },
    td: {
        padding: '1rem 1.5rem',
        verticalAlign: 'middle',
    },
    websiteCell: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    favicon: {
        width: '36px',
        height: '36px',
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        color: 'var(--text-primary)',
    },
    websiteInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    websiteName: {
        fontWeight: '600',
        fontSize: '1rem',
    },
    link: {
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        fontSize: '0.8rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
    },
    username: {
        color: 'var(--text-secondary)',
        fontFamily: 'monospace',
        fontSize: '0.95rem',
    },
    passwordCell: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: 'var(--bg-color)',
        border: '1px solid var(--border-color)',
        padding: '0.4rem 0.75rem',
        borderRadius: '6px',
        width: 'fit-content',
    },
    passwordText: {
        fontFamily: 'monospace',
        minWidth: '100px',
        color: 'var(--text-secondary)',
    },
    iconBtn: {
        background: 'transparent',
        border: 'none',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
    },
    deleteBtn: {
        background: 'rgba(239, 68, 68, 0.1)',
        border: 'none',
        color: 'var(--danger)',
        padding: '0.5rem',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background 0.2s',
    },
    emptyState: {
        padding: '4rem',
        textAlign: 'center',
        color: 'var(--text-secondary)',
    },
    emptyContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
    },
    // Modal Styles
    overlay: {
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1rem',
    },
    backdrop: {
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)',
    },
    modal: {
        background: 'var(--card-bg)',
        width: '100%',
        maxWidth: '450px',
        borderRadius: '16px',
        padding: '2rem',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid var(--border-color)',
    },
    modalHeader: {
        marginBottom: '2rem',
        textAlign: 'center',
    },
    modalSub: {
        color: 'var(--text-secondary)',
        margin: '0.5rem 0 0',
        fontSize: '0.9rem',
    },
    closeBtn: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        background: 'transparent',
        border: 'none',
        color: 'var(--text-secondary)',
        fontSize: '1.5rem',
        padding: 0,
        cursor: 'pointer',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
    },
    inputContainer: {
        position: 'relative',
    },
    inputIcon: {
        position: 'absolute',
        left: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
    },
    input: {
        width: '100%',
        background: 'var(--bg-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '0.85rem 1rem 0.85rem 3rem',
        color: 'var(--text-primary)',
        outline: 'none',
        fontSize: '1rem',
        transition: 'border-color 0.2s',
    },
    submitBtn: {
        background: 'var(--primary)',
        color: 'var(--primary-text)',
        border: 'none',
        padding: '1rem',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '0.5rem',
        boxShadow: '0 4px 12px rgba(255, 255, 255, 0.1)',
    },
};

export default Dashboard;

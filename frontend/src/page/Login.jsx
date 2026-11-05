import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

function Login() {

    const [role, setRole] = useState('user');

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/login`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    credentials: 'include',

                    body: JSON.stringify({
                        email,
                        password,
                        role
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message);
                return;
            }

            if (data.user.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/user-dashboard');
            }

        } catch (error) {

            setMessage('Server connection failed');

        }

    };

    return (

        <div className="auth-container">

            <div className="auth-card">

                <h1>Kalai's</h1>

                <h2>Welcome Back!</h2>

                <p>Choose your login type</p>

                <div className="login-options">

                    <button
                        type="button"
                        className={role === 'user' ? 'selected' : ''}
                        onClick={() => setRole('user')}
                    >
                        User Login
                    </button>

                    <button
                        type="button"
                        className={role === 'admin' ? 'selected' : ''}
                        onClick={() => setRole('admin')}
                    >
                        Admin Login
                    </button>

                </div>

                <form onSubmit={handleLogin}>

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">
                        Login
                    </button>

                </form>

                {message && <p className="error-message">{message}</p>}

                {role === 'user' && (

                    <p>
                        Don't have an account?

                        <Link to="/register">
                            Register Now
                        </Link>
                    </p>

                )}

                <Link to="/" className="back-link">
                    Back to Home
                </Link>

            </div>

        </div>

    );

}

export default Login;
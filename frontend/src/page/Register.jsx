import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

function Register() {

    const [name, setName] = useState('');

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/register`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message);
                return;
            }

            navigate('/login');

        } catch (error) {

            setMessage('Server connection failed');

        }

    };

    return (

        <div className="auth-container">

            <div className="auth-card">

                <h1>Kalai's</h1>

                <h2>Create Account</h2>

                <p>Register to start shopping</p>

                <form onSubmit={handleRegister}>

                    <input
                        type="text"
                        placeholder="Enter Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Create Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={8}
                        required
                    />

                    <button type="submit">
                        Register
                    </button>

                </form>

                {message && <p className="error-message">{message}</p>}

                <p>
                    Already have an account?

                    <Link to="/login">
                        Login Now
                    </Link>
                </p>

            </div>

        </div>

    );

}

export default Register;
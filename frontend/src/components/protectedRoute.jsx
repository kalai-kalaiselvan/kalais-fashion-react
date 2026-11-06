import React, { useEffect, useState } from 'react';

import { Navigate } from 'react-router-dom';

function ProtectedRoute({ role, children }) {

    const [status, setStatus] = useState('loading');

    useEffect(() => {
fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        // fetch('http://localhost:5000/api/auth/me', {
            credentials: 'include'
        })
        .then(async (response) => {

            if (!response.ok) {
                throw new Error('Not logged in');
            }

            return response.json();

        })
        .then((data) => {

            setStatus(
                data.user.role === role ? 'allowed' : 'denied'
            );

        })
        .catch(() => {

            setStatus('denied');

        });

    }, [role]);

    if (status === 'loading') {
        return <p>Checking login...</p>;
    }

    if (status === 'denied') {
        return <Navigate to="/login" replace />;
    }

    return children;

}

export default ProtectedRoute;
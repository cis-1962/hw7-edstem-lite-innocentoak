// Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {

    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            await axios.post('/api/account/login', { username, password });

            navigate('/');

        } catch (error) {

            alert('could not login');

        }
    };

    return (
        <div className="login-container">
            <h2>Log In</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="username" className="form-label">Username:</label>
                    <input
                        id="username"
                        type="text"
                        className="form-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input
                        id="password"
                        type="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                </div>
                <button type="submit" className="btn-login">Log In</button>
                <p className="signup-prompt">
                    Don't have an account? <Link to="/signup" className="signup-link">Sign up!</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;

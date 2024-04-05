import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function SignUp() {

    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            await axios.post('/api/account/signup', { username, password });

            navigate('/');

        } catch (error) {

            alert('could not sign up');

        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} className="signup-form">
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
                <button type="submit" className="btn-signup">Sign Up</button>
                <p className="login-prompt">
                    Already have an account? <Link to="/login" className="login-link">Log in here!</Link>
                </p>
            </form>
        </div>
    );
}

export default SignUp;

import React, { useState } from 'react';
import API_CONFIG from "../config.js";
const Login = ({ onLoginSuccess }) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState('User');

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(API_CONFIG.LOGIN_API, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
    userName: userName, 
    password: password,
    role: role
})
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('jwt_token', data.token);
                
                if (onLoginSuccess) {
                    onLoginSuccess();
                }
            } else if (response.status === 401) {
                alert('Invalid user credentials');
            } else if (response.status === 403) {
                alert('You are not get access because you are unauthorized');
            } else {
                alert('Something went wrong. Please try again later.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Network error - Unable to reach the server.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
                    <input 
                        type="text" 
                        value={userName} 
                        onChange={(e) => setUserName(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Role:</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
                <button 
                    type="submit" 
                    disabled={isLoading}
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        backgroundColor: '#007BFF', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '3px',
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}>
                    {isLoading ? 'Verifying...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;
'use client';

import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useRouter } from 'next/router';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Register: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/auth/register', { email, password });
            setMessage('Registration successful. You can now log in.');
            setTimeout(() => {
                router.push('/');
            }, 2000);
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Registration failed.');
        }
    };

    // Google Auth
    const handleGoogleRegister = async (credentialResponse: any) => {
        try {
            const { credential } = credentialResponse;
            const res = await axiosInstance.post('/auth/google', { token: credential });
            localStorage.setItem('jwt', res.data.token);
            setMessage('Registration successful with Google. Redirecting to home page.');
            setTimeout(() => {
                // router.push('/');
            }, 2000);
        } catch (err: any) {
            console.error('Google Register Failed:', err.response?.data || err.message);
            setMessage('Google Registration failed.');
        }
    };

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
            <div className="mx-auto w-fit">
                <h1>Register</h1>
                <form onSubmit={handleRegister}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Register</button>
                </form>
                <div style={{ margin: '20px 0' }}>
                    <p>Or register using Google:</p>
                    <GoogleLogin
                        onSuccess={handleGoogleRegister}
                        onError={() => setMessage('Google Login failed.')}
                    />
                </div>
                {message && <p>{message}</p>}
            </div>
        </GoogleOAuthProvider>
    );
};

export default Register;

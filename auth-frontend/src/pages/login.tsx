'use client';
import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance'; // Ensure this exists
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useGoogleLogin } from 'react-use-googlelogin';
// import { useGoogleLogin } from 'react-google-login'; // Install this dependency

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const router = useRouter();

    // Handle traditional email/password login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/auth/login', { email, password });
            localStorage.setItem('jwt', response.data.token);
            setMessage('Login successful. Redirecting to home page now.');
            setTimeout(() => {
                router.push('/');
            }, 2000);
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Login failed.');
        }
    };

    // Handle Google Login success
    const onGoogleLoginSuccess = async (response: any) => {
        try {
            const { data } = await axiosInstance.post('/auth/google', {
                token: response.tokenId, // Google Token from response
            });
            localStorage.setItem('jwt', data.token);
            setMessage('Google Login successful. Redirecting to home page now.');
            setTimeout(() => {
                router.push('/');
            }, 2000);
            alert('Login Successfull')
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Google Login failed.');
            alert('Login Failed')
        }
    };

    // Handle Google Login failure
    const onGoogleLoginFailure = (error: any) => {
        console.error('Google Login Error:', error);
        setMessage('Google Login failed.');
        alert('Login Failed')
    };

    const { signIn } = useGoogleLogin({
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        onSuccess: onGoogleLoginSuccess,
        onFailure: onGoogleLoginFailure,
        isSignedIn: true,
    });

    return (
        <div className="mx-auto w-fit">
            <h1>Login</h1>
            {/* <Link href="/">
            </Link> */}
            {/* <a>Back to Home</a> */}
            <form onSubmit={handleLogin}>
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
                <button type="submit">Login</button>
            </form>
            <div className="my-4">
                <button
                    onClick={signIn}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400"
                >
                    Login with Google
                </button>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login; // Make sure it’s exported correctly

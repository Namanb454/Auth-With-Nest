import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '../utils/axiosInstance';

interface User {
    email: string;
}

const Profile: React.FC = () => {
    const [user, setUser] = useState < User | null > (null);
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get('/auth/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                });
                setUser(response.data);
            } catch (err) {
                router.push('/login'); // Redirect to login if unauthorized
            }
        };

        fetchProfile();
    }, []);

    if (!user) return <p>Loading...</p>;

    return (
        <div>
            <h1>Welcome, {user.email}</h1>
            <p>This is your profile page.</p>
        </div>
    );
};

export default Profile;

'use client'

import Link from 'next/link';
import React from 'react';

const Navbar: React.FC = () => {
    return (
        <nav>
            <div className='w-full h-screen space-x-20 flex justify-center items-center text-2xl'>
                <Link className='w-40 text-center border-2 border-white rounded-md p-5' href="/login">Login</Link>
                <Link className='w-40 text-center border-2 border-white rounded-md p-5' href="/register">Register</Link>
            </div>
        </nav>
    );
};

export default Navbar;

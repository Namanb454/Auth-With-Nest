// 'use client'
// import '../styles/globals.css'; // Global styles
import { AppProps } from 'next/app';
// import Navbar from '../components/Navbar'; // Default import

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            {/* <Navbar /> */}
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;

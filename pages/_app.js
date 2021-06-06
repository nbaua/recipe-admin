import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Footer from '../components/footer';
import Header from '../components/header';
import '../styles/globals.css';
import { AppContextProvider } from './../utils/app-context';

function MyApp({ Component, pageProps }) {
	let [isLoggedIn, setIsLoggedIn] = useState(false);
	const router = useRouter();

	useEffect(() => {
		setIsLoggedIn(localStorage.getItem('token') !== '');
	}, [router]);

	const handleLogin = (e) => {
		setIsLoggedIn(!isLoggedIn);
		localStorage.removeItem('token');
		router.push('/login');
	};

	return (
		<AppContextProvider>
			<Header isLoggedIn={isLoggedIn} />
			<section style={{ minHeight: '95vh', marginBottom: -60, paddingTop: 20 }}>
				<Component {...pageProps} />
			</section>
			<Footer />
		</AppContextProvider>
	);
}

export default MyApp;

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import '../styles/globals.css';
import { AppContextProvider } from './../utils/app-context';

function MyApp({ Component, pageProps }) {
	let [isModal, setIsModal] = useState(false);
	let [isLoggedIn, setIsLoggedIn] = useState(false);
	const router = useRouter();

	useEffect(() => {
		setIsLoggedIn(localStorage.getItem('token') !== '');
	}, [router]);

	const handleClick = () => {
		setIsModal((isModal = !isModal));
	};

	const handleLogin = (e) => {
		setIsLoggedIn(!isLoggedIn);
		localStorage.removeItem('token');
		router.push('/login');
	};

	const active = isModal ? 'is-active' : '';
	return (
		<section>
			<Head>
				<title>Recipe Admin</title>
				<meta name='viewport' content='initial-scale=1.0, width=device-width' />
				<meta name='description' content='Recipe Admin - Created by Nhilesh Baua' />
				<meta name='author' content='Nhilesh Baua' />
				<meta name='keywords' content='Recipe Admin, React, Next, React JS, Next Js, Bulma, Bulma CSS, React.JS, Next.JS' />
				<meta name='revised' content={new Date()} />
			</Head>
			<AppContextProvider>
				<div className={`modal ${active}`}>
					<div className='modal-background' />
					<div className='modal-card'>
						<header className='modal-card-head'>
							<p className='modal-card-title'>Recipe Admin - V1</p>
							<button onClick={handleClick} className='delete' aria-label='close' />
						</header>
						<section className='modal-card-body'>
							<div className='field'>
								<label className='checkbox'>Recipe Admin is created using React library and NextJS framework With Bulma CSS.</label>
								<div className='control mt-5'>Created by Nhilesh Baua, India</div>
							</div>
						</section>
						<footer className='modal-card-foot'>
							<button onClick={handleClick} className='button is-primary'>
								Thanks
							</button>
						</footer>
					</div>
				</div>

				<header>
					<nav className='navbar is-dark is-fixed-top' role='navigation' aria-label='main navigation'>
						<input type='checkbox' id='toggler' role='button' className='toggler' aria-label='menu' aria-expanded='false' data-target='mainBar' />
						<div className='navbar-brand'>
							<a className='navbar-item' href='/'>
								<Image src='/logo.svg' width='129' height='36' />
							</a>
							<label className='navbar-burger burger'>
								<span aria-hidden='true'></span>
								<span aria-hidden='true'></span>
								<span aria-hidden='true'></span>
							</label>
						</div>

						<div id='mainBar' className='navbar-menu'>
							<div className='navbar-start'>
								<a className='navbar-item' href='/'>
									Home
								</a>
								<Link href='/recipes'>
									<a className='navbar-item'>Recipes</a>
								</Link>
							</div>
							<div className='navbar-end'>
								<div className='navbar-item'>
									<div className='navbar-item has-dropdown is-hoverable'>
										<a className='navbar-link'>{isLoggedIn ? 'Welcome Admin' : 'Welcome Anonymous'}</a>
										<div className='navbar-dropdown'>
											<a className='navbar-item' onClick={handleLogin}>
												{isLoggedIn ? 'Logout' : 'Login'}
											</a>
											<hr className='navbar-divider' />
											<a className='navbar-item' onClick={handleClick}>
												About
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</nav>
				</header>
				<Component {...pageProps} />
			</AppContextProvider>
		</section>
	);
}

export default MyApp;

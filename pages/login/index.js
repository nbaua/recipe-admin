import { useRouter } from 'next/router';
import React from 'react';
import { useAppContext } from './../../utils/app-context';

function Login() {
	const { setActiveUserTokenHandler } = useAppContext();
	const router = useRouter();

	const handleLogin = (e) => {
		e.preventDefault();
		fetch(process.env.NEXT_PUBLIC_LOGIN_URL, {
			method: 'POST',
			// mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: e.target.email.value,
				password: e.target.password.value,
			}),
		})
			.then((response) => {
				response.json().then((data) => {
					localStorage.setItem('token', data.token);
					setActiveUserTokenHandler(data.token);
					router.push('/');
				});
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<div className='column is-3 is-offset-4'>
			<div className='container section mt-6'>
				<div className='card'>
					<form className='box' onSubmit={handleLogin}>
						<div className='field'>
							<label className='label'>Email</label>
							<div className='control'>
								<input className='input' id='email' name='email' type='email' maxLength='50' required={true} placeholder='Enter your valid email id' />
							</div>
						</div>

						<div className='field'>
							<label className='label'>Password</label>
							<div className='control'>
								<input className='input' id='password' name='password' type='password' maxLength='50' required={true} placeholder='*********' />
							</div>
						</div>
						<button className='button is-primary' type='submit'>
							Sign in
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Login;

import React from 'react';
import { useAppContext } from './../../utils/app-context';

function Login() {
	const { activeSession } = useAppContext();

	return (
		<div className='container section  mt-6'>
			<div className='card'>
				<form className='box'>
					<div className='field'>
						<label className='label'>Email</label>
						<div className='control'>
							<input className='input' type='email' placeholder='e.g. alex@example.com' />
						</div>
					</div>

					<div className='field'>
						<label className='label'>Password</label>
						<div className='control'>
							<input className='input' type='password' placeholder='********' />
						</div>
					</div>

					<button className='button is-primary'>Sign in</button>
				</form>
			</div>
		</div>
	);
}

export default Login;

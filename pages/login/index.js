import React from 'react';
import { useAppContext } from './../../utils/app-context';

function Login() {
	const { activeSession } = useAppContext();

	return (
		<div className='container section  mt-6'>
			<div className='card'>
				<form class='box'>
					<div class='field'>
						<label class='label'>Email</label>
						<div class='control'>
							<input class='input' type='email' placeholder='e.g. alex@example.com' />
						</div>
					</div>

					<div class='field'>
						<label class='label'>Password</label>
						<div class='control'>
							<input class='input' type='password' placeholder='********' />
						</div>
					</div>

					<button class='button is-primary'>Sign in</button>
				</form>
			</div>
		</div>
	);
}

export default Login;

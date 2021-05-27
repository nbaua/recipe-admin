import React from 'react';
import { useAppContext } from './../utils/app-context';

function rootPage() {
	const { activeSession } = useAppContext();

	return (
		<section className='hero is-success is-halfheight'>
			<div className='hero-body'>
				<div>
					<p className='title'>Weekly Dashboard</p>
					<p className='subtitle'>Loading...</p>
				</div>
			</div>
		</section>
	);
}

export default rootPage;

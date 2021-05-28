import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppContext } from './../../utils/app-context';

function recipeDetail() {
	const { activeUserToken } = useAppContext();
	const router = useRouter();
	const [recipeId, setRecipeId] = useState();

	useEffect(() => {
		if (activeUserToken === '') {
			router.push('/login');
		}

		if (router.asPath !== router.route) {
			setRecipeId(router.query.id);
		}
	}, [router]);

	return (
		<section className='hero is-success is-halfheight'>
			<div className='hero-body'>
				<div className=''>
					<p className='title'>Deep Linking Recipes</p>
					<p className='subtitle'>Loading details for {recipeId}...</p>
				</div>
			</div>
		</section>
	);
}

export default recipeDetail;

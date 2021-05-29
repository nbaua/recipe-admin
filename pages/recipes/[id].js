import { Field, FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppContext } from './../../utils/app-context';

function recipeDetail() {
	const { activeUserToken } = useAppContext();
	// const { getActiveUserTokenHandler } = useAppContext();
	const router = useRouter();
	const [recipeId, setRecipeId] = useState();
	const [recipe, setRecipe] = useState({});
	const [initialValues, setInitialValues] = useState();
	const onSubmit = (values) => {
		alert(JSON.stringify(values, null, 2));
	};

	const formikBag = useFormik({
		initialValues: {
			name: '',
			category: '',
			description: '',
			pictureUrl: '',
			servings: '',
			likes: 0,
			views: 0,
			published: false,
		},
		onSubmit,
	});
	const { values, setFieldValue, handleSubmit } = formikBag;

	//this is to be replaced with actual token handler
	const getActiveUserTokenHandler = () => {
		return 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDhlMzZlYzNjMTJlOTIwNDRhNjYxZGYiLCJlbWFpbCI6ImFkbWluQGFwaS5jb20iLCJpYXQiOjE2MjIyNTYwODZ9.1LHQvB7Dcf0NPswzEd3ugDQErq5-aFCjy3xmilIA29o';
	};

	useEffect(() => {
		if (router.isReady) {
			if (getActiveUserTokenHandler() === '') {
				router.push('/login');
			} else {
				setRecipeId(router.query.id);
				getDataFromRemoteAPI(router.query.id, getActiveUserTokenHandler());
			}
		}
	}, [router.isReady]);

	const getDataFromRemoteAPI = async (id, t) => {
		const headers = { 'Content-Type': 'application/json', Authorization: t };
		await fetch(process.env.NEXT_PUBLIC_RECIPE_BY_ID_URL.replace('{ID}', id), { headers })
			.then((response) => response.json())
			.then((res) => {
				setRecipe(res);
				Object.keys(res).map(function (key, index) {
					setFieldValue(key, res[key]);
				});
			});
	};

	return (
		<div className='section  mt-6'>
			<FormikProvider enableReinitialize={true} value={formikBag}>
				<form onSubmit={formikBag.handleSubmit}>
					<div className='columns subtitle is-5'>{recipe.name}</div>
					<div className='columns'>
						<div className='column'>
							<div className='field'>
								<label className='label is-small'>Enter Name</label>
								<div className='control'>
									<Field className='input is-small' id='name' name='name' type='text' onChange={(e) => setFieldValue('name', e.target.value)} value={formikBag.values.name} />
								</div>
							</div>
							<div className='field'>
								<label className='label is-small'>Enter Category</label>
								<div className='control'>
									<Field className='input is-small' id='category' name='category' type='text' onChange={(e) => setFieldValue('category', e.target.value)} value={formikBag.values.category} />
								</div>
							</div>
							<div className='field'>
								<label className='label is-small'>Enter Description</label>
								<div className='control'>
									<textarea className='textarea' id='description' name='description' onChange={(e) => setFieldValue('description', e.target.value)} value={formikBag.values.description}></textarea>
								</div>
							</div>
							<div className='field'>
								<label className='label is-small'>Enter Picture Url</label>
								<div className='control'>
									<Field className='input is-small' id='pictureUrl' name='pictureUrl' type='text' onChange={(e) => setFieldValue('pictureUrl', e.target.value)} value={formikBag.values.pictureUrl} />
								</div>
							</div>
							<div className='field'>
								<label className='label is-small'>Enter Servings</label>
								<div className='control'>
									<Field className='input is-small' id='servings' name='servings' type='text' onChange={(e) => setFieldValue('servings', e.target.value)} value={formikBag.values.servings} />
								</div>
							</div>
							<div className='field'>
								<label className='label is-small'>Enter Views</label>
								<div className='control'>
									<Field className='input is-small' id='views' name='views' type='number' onChange={(e) => setFieldValue('views', e.target.value)} value={formikBag.values.views} />
								</div>
							</div>
							<div className='field'>
								<label className='label is-small'>Enter Likes</label>
								<div className='control'>
									<Field className='input is-small' id='likes' name='likes' type='number' onChange={(e) => setFieldValue('likes', e.target.value)} value={formikBag.values.likes} />
								</div>
							</div>
							<div className='field'>
								<div className='control'>
									<label className='checkbox'>
										<input type='checkbox' name='published' id='published' value='One' onChange={(e) => setFieldValue('published', e.target.value)} value={formikBag.values.published} />
										&nbsp;Published?
									</label>
								</div>
							</div>
						</div>
						<div className='column'>
							<button className='button is-small is-primary' type='submit'>
								Submit Values
							</button>
						</div>
					</div>
				</form>
			</FormikProvider>
		</div>
	);
}

export default recipeDetail;

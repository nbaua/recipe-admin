import { Field, FieldArray, FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppContext } from './../../utils/app-context';

function recipeDetail() {
	const { activeUserToken } = useAppContext();
	// const { getActiveUserTokenHandler } = useAppContext();
	const router = useRouter();
	const [activeTab, setActiveTab] = useState(0);
	const [recipeId, setRecipeId] = useState();
	const [recipe, setRecipe] = useState({});
	const [initialValues, setInitialValues] = useState();

	const onSubmit = (values) => {
		delete values._id;
		console.log(JSON.stringify(values, null, 2));
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
				console.log(res);
				Object.keys(res).map(function (key, index) {
					setFieldValue(key, res[key]);
				});
			});
	};

	return (
		<div className='section mt-6'>
			<FormikProvider enableReinitialize={true} value={formikBag}>
				<form onSubmit={formikBag.handleSubmit}>
					<div className='columns'>
						<div className='column is-size-5 is-6'>{recipe.name}</div>
						<div className='column is-size-6 is-4 tabs'>
							<ul>
								<li
									className={activeTab === 0 ? 'is-active' : ''}
									onClick={() => {
										setActiveTab(0);
									}}>
									<a>Ingredients</a>
								</li>
								<li
									className={activeTab === 1 ? 'is-active' : ''}
									onClick={() => {
										setActiveTab(1);
									}}>
									<a>Instructions</a>
								</li>
								<li
									className={activeTab === 2 ? 'is-active' : ''}
									onClick={() => {
										setActiveTab(2);
									}}>
									<a>Preparation Time</a>
								</li>
							</ul>
						</div>
						<div className='column is-size-6 is-2 '>
							<button className='button is-primary is-pulled-right' type='submit'>
								Submit Values
							</button>
						</div>
					</div>
					<div className='columns'>
						<div className='column'>
							<div className='field'>
								<label className='label is-small'>Enter Name</label>
								<div className='control'>
									<Field className='input' id='name' name='name' type='text' onChange={(e) => setFieldValue('name', e.target.value)} value={formikBag.values.name} />
								</div>
							</div>
							<div className='field'>
								<label className='label is-small'>Enter Category</label>
								<div className='control'>
									<Field className='input' id='category' name='category' type='text' onChange={(e) => setFieldValue('category', e.target.value)} value={formikBag.values.category} />
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
									<Field className='input' id='pictureUrl' name='pictureUrl' type='text' onChange={(e) => setFieldValue('pictureUrl', e.target.value)} value={formikBag.values.pictureUrl} />
								</div>
							</div>
							<div className='field'>
								<label className='label is-small'>Enter Servings</label>
								<div className='control'>
									<Field className='input' id='servings' name='servings' type='text' onChange={(e) => setFieldValue('servings', e.target.value)} value={formikBag.values.servings} />
								</div>
							</div>
							<div className='field'>
								<label className='label is-small'>Enter Views</label>
								<div className='control'>
									<Field className='input' id='views' name='views' type='number' onChange={(e) => setFieldValue('views', e.target.value)} value={formikBag.values.views} />
								</div>
							</div>
							<div className='field'>
								<label className='label is-small'>Enter Likes</label>
								<div className='control'>
									<Field className='input' id='likes' name='likes' type='number' onChange={(e) => setFieldValue('likes', e.target.value)} value={formikBag.values.likes} />
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
						<div className='column '>
							{activeTab === 0 && (
								<div className='column tab'>
									<FieldArray
										name='ingredients'
										render={(arrayHelpers) => (
											<div className='is-grouped'>
												{values.ingredients && values.ingredients.length > 0 ? (
													values.ingredients.map((ingredient, index) => (
														<div key={index}>
															<div className='field '>
																<div className='field-body'>
																	<div className='field is-expanded'>
																		<div className='field has-addons'>
																			<div className='control is-expanded'>
																				<label className='label is-small'>Enter Ingredient's Name</label>
																				<Field className='input' id={`ingredients.${index}.name`} name={`ingredients.${index}.name`} />
																			</div>
																			<div className='control is-1'>
																				<label className='label is-small'>Qty - Amount </label>
																				<Field className='input' id={`ingredients.${index}`} name={`ingredients.${index}.amount`} />
																			</div>
																			<div className='control is-1'>
																				<label className='label is-small'>Qty- Unit</label>
																				<Field className='input' id={`ingredients.${index}.unit`} name={`ingredients.${index}.unit`} />
																			</div>
																			<div className='control mt-5'>
																				<button className='button is-danger' type='button' onClick={() => arrayHelpers.remove(index)}>
																					-
																				</button>
																			</div>
																			<div className='control mt-5'>
																				<button className='button is-success' type='button' onClick={() => arrayHelpers.insert(index, '')}>
																					+
																				</button>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													))
												) : (
													<button className='button is-success' type='button' onClick={() => arrayHelpers.push('')}>
														Add an Ingredient
													</button>
												)}
											</div>
										)}
									/>
								</div>
							)}
							{activeTab === 1 && (
								<div className='column tab'>
									<FieldArray
										name='instructions'
										render={(arrayHelpers) => (
											<div className='is-grouped'>
												{values.instructions && values.instructions.length > 0 ? (
													values.instructions.map((instruction, index) => (
														<div key={index}>
															<div className='field '>
																<div className='field-body'>
																	<div className='field is-expanded'>
																		<div className='field has-addons'>
																			<div className='control is-1'>
																				<label className='label is-small'>Instruction's Rank (Enter dash - to skip)</label>
																				<Field className='input' id={`instructions.${index}.step`} name={`instructions.${index}.step`} />
																			</div>
																			<div className='control is-expanded'>
																				<label className='label is-small'>Instruction's Description </label>
																				<Field className='input' id={`instructions.${index}`} name={`instructions.${index}.description`} />
																			</div>

																			<div className='control mt-5'>
																				<button className='button is-danger' type='button' onClick={() => arrayHelpers.remove(index)}>
																					-
																				</button>
																			</div>
																			<div className='control mt-5'>
																				<button className='button is-success' type='button' onClick={() => arrayHelpers.insert(index, '')}>
																					+
																				</button>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													))
												) : (
													<button className='button is-success' type='button' onClick={() => arrayHelpers.push('')}>
														Add an Instruction (Step)
													</button>
												)}
											</div>
										)}
									/>
								</div>
							)}
							{activeTab === 2 && (
								<div className='column tab'>
									<FieldArray
										name='times'
										render={(arrayHelpers) => (
											<div className='is-grouped'>
												{values.times && values.times.length > 0 ? (
													values.times.map((tm, index) => (
														<div key={index}>
															<div className='card mb-5'>
																<header>
																	<Field className='input has-text-grey-dark has-background-warning-light' disabled id={`times.${index}.type`} name={`times.${index}.type`} />
																</header>
																<div className='card-content'>
																	<div className='field is-grouped'>
																		<div className='control is-expanded'>
																			<label className='label is-small'>Time Required (hr)</label>
																			<Field className='input' id={`times.${index}.hr`} name={`times.${index}.hr`} />
																		</div>
																		<div className='control is-expanded'>
																			<label className='label is-small'>Time Required (min)</label>
																			<Field className='input' id={`times.${index}.min`} name={`times.${index}.min`} />
																		</div>
																	</div>
																</div>
															</div>
														</div>
													))
												) : (
													<button className='button is-success' type='button' onClick={() => arrayHelpers.push('')}>
														Add a Time
														{/* This is not used for time being - kept for future compatibility  */}
													</button>
												)}
											</div>
										)}
									/>
								</div>
							)}
						</div>
					</div>
				</form>
			</FormikProvider>
		</div>
	);
}

export default recipeDetail;

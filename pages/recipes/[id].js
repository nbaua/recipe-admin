import { Widget } from '@uploadcare/react-widget';
import { Field, FieldArray, FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppContext } from './../../utils/app-context';
// import { Widget } from '@uploadcare/react-widget';

function recipeDetail() {
	const { activeUserToken } = useAppContext();
	// const { getActiveUserTokenHandler } = useAppContext();
	const router = useRouter();
	const [activeTab, setActiveTab] = useState(0);
	const [recipeId, setRecipeId] = useState();
	const [recipe, setRecipe] = useState({});
	const [initialValues, setInitialValues] = useState();

	const onSubmit = (values) => {
		const id = values._id;
		delete values._id;
		// console.log(JSON.stringify(values, null, 2));

		fetch(process.env.NEXT_PUBLIC_UPDATE_RECIPE_BY_ID_URL.replace('{ID}', id), {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: getActiveUserTokenHandler(),
			},
			body: JSON.stringify(values),
		})
			.then((response) => {
				response.json().then((data) => {
					if (data) {
						router.push('/recipes');
					}
				});
			})
			.catch((error) => {
				console.error(error);
			});
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

	const uploadToWP = () => {};

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
								<li
									className={activeTab === 3 ? 'is-active' : ''}
									onClick={() => {
										setActiveTab(3);
									}}>
									<a>Tags</a>
								</li>
								<li
									className={activeTab === 4 ? 'is-active' : ''}
									onClick={() => {
										setActiveTab(4);
									}}>
									<a>Preview Changes</a>
								</li>
							</ul>
						</div>
						<div className='column is-size-6 is-2 '>
							<button className='button is-small is-primary is-pulled-right' type='submit'>
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
								<div className='field is-grouped'>
									<div className='control is-expanded'>
										<label className='label is-small'>Enter Picture Url</label>
										<div className='control'>
											<Field className='input' id='pictureUrl' name='pictureUrl' type='text' onChange={(e) => setFieldValue('pictureUrl', e.target.value)} value={formikBag.values.pictureUrl} />
										</div>
									</div>
									<div className='control'>
										<label className='label is-small'>&nbsp;</label>
										<div className='control'>
											<Widget
												tabs='file url'
												previewStep={true}
												imagesOnly={true}
												multiple={false}
												publicKey={process.env.NEXT_PUBLIC_UPLOADER_PUB_KEY}
												onFileSelect={(e) => {
													e.done((file) => {
														console.log(file.originalUrl);
														formikBag.values.pictureUrl = file.originalUrl;
														setFieldValue('pictureUrl', file.originalUrl);
													});
												}}
											/>
										</div>
									</div>
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
									<Field className='input' id='views' name='views' type='number' />
								</div>
							</div>
							<div className='field'>
								<label className='label is-small'>Enter Likes</label>
								<div className='control'>
									<Field className='input' id='likes' name='likes' type='number' />
								</div>
							</div>
							<div className='field'>
								<div className='control'>
									<label className='checkbox'>
										<Field type='checkbox' name='published' />
										&nbsp;Published?
									</label>
								</div>
							</div>
						</div>
						<div className='column ' style={{ height: 700, overflow: 'scroll' }}>
							{activeTab === 0 && (
								<div className='column tab'>
									<FieldArray
										name='ingredients'
										render={(arrayHelpers) => (
											<div className='is-grouped'>
												{values.ingredients && values.ingredients.length > 0 ? (
													values.ingredients.map((ingredient, index) => (
														<div key={index}>
															<div className='card mb-3'>
																<div className='card-content'>
																	<div className='control'>
																		<label className='label is-small'>Enter Ingredient's Name</label>
																		<div className='control'>
																			<Field className='input' id={`ingredients.${index}.name`} name={`ingredients.${index}.name`} />
																		</div>
																	</div>
																	<div className='content'>
																		<div className='field is-grouped'>
																			<div className='control'>
																				<label className='label is-small'>Qty - Amount </label>
																				<div className='control'>
																					<Field className='input' id={`ingredients.${index}`} name={`ingredients.${index}.amount`} />
																				</div>
																			</div>
																			<div className='control'>
																				<label className='label is-small'>Qty- Unit</label>
																				<div className='control'>
																					<Field className='input' id={`ingredients.${index}.unit`} name={`ingredients.${index}.unit`} />
																				</div>
																			</div>
																			<div className='control'>
																				<label className='label is-small has-text-grey-light'>Removes the entire form</label>
																				<button className='button is-small is-danger' type='button' onClick={() => arrayHelpers.remove(index)}>
																					Remove Block
																				</button>
																			</div>
																			<div className='control'>
																				<label className='label is-small has-text-grey-light'>Adds a new form</label>
																				<button className='button is-small is-info' type='button' onClick={() => arrayHelpers.insert(index, '')}>
																					Insert Block
																				</button>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													))
												) : (
													<h4>Let's roll something new...</h4>
												)}
												<button className='button is-small is-success mb-3 mt-3' type='button' onClick={() => arrayHelpers.push({ name: '', unit: '', amount: '' })}>
													Add an Ingredient
												</button>
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
																<div className='card mb-3'>
																	<div className='card-content'>
																		<div className='content'>
																			<div className='field is-grouped'>
																				<div className='control'>
																					<label className='label is-small'>Auto-Id</label>
																					<div className='control'>
																						<Field className='input' id={`instructions.${index}._id`} name={`instructions.${index}._id`} />
																					</div>
																				</div>
																				<div className='control'>
																					<label className='label is-small'>Instruction's Rank (Enter dash - to skip)</label>
																					<div className='control'>
																						<Field className='input' id={`instructions.${index}.step`} name={`instructions.${index}.step`} />
																					</div>
																				</div>
																				<div className='control'>
																					<label className='label is-small has-text-grey-light'>Removes the entire form</label>
																					<button className='button is-small is-danger' type='button' onClick={() => arrayHelpers.remove(index)}>
																						Remove Block
																					</button>
																				</div>
																				<div className='control'>
																					<label className='label is-small has-text-grey-light'>Adds a new form</label>
																					<button className='button is-small is-info' type='button' onClick={() => arrayHelpers.insert(index, { _id: Math.random(), step: 'Step ' + Math.random(), description: '...' })}>
																						Insert Block
																					</button>
																				</div>
																			</div>
																		</div>
																		<div className='control'>
																			<label className='label is-small'>Instruction's Description </label>
																			<div className='control'>
																				<Field className='input' id={`instructions.${index}`} name={`instructions.${index}.description`} />
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													))
												) : (
													<h4>Let's roll something new...</h4>
												)}
												<button className='button is-small is-success mb-3 mt-3' type='button' onClick={() => arrayHelpers.push({ _id: values.instructions.length + 1, step: 'Step ' + (values.instructions.length + 1), description: '...' })}>
													Add an Instruction (Step)
												</button>
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
													<button className='button is-small is-success' type='button' onClick={() => arrayHelpers.push('')}>
														Add a Time
													</button>
												)}
											</div>
										)}
									/>
								</div>
							)}
							{activeTab === 3 && (
								<div className='column tab'>
									<FieldArray
										name='tags'
										render={(arrayHelpers) => (
											<div className='is-grouped'>
												{values.tags && values.tags.length > 0 ? (
													values.tags.map((tm, index) => (
														<div key={index}>
															<div className='card mb-5'>
																<div className='card-content'>
																	<div className='field is-grouped'>
																		<div className='control is-expanded'>
																			<label className='label is-small'>Enter Tag</label>
																			<Field className='input' id={`tags.${index}`} name={`tags.${index}`} />
																		</div>
																		<div className='control'>
																			<label className='label is-small has-text-grey-light'>Removes the entire form</label>
																			<button className='button is-small is-danger' type='button' onClick={() => arrayHelpers.remove(index)}>
																				Remove Tag
																			</button>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													))
												) : (
													<h4>Let's roll something new...</h4>
												)}
												<button className='button is-small is-success mb-3 mt-3' type='button' onClick={() => arrayHelpers.push('')}>
													Add a Tag
												</button>
											</div>
										)}
									/>
								</div>
							)}
							{activeTab === 4 && (
								<div className='column tab'>
									<pre>{JSON.stringify(values, null, 2)}</pre>
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

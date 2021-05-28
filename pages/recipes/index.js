import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { usePagination, useTable } from 'react-table';
import { useAppContext } from './../../utils/app-context';

function Recipes() {
	const { getActiveUserTokenHandler } = useAppContext();
	const router = useRouter();
	const [data, setData] = useState([]);
	const [meta, setMeta] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	const [token, setToken] = useState('1');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		if (getActiveUserTokenHandler() === '') {
			router.push('/login');
		} else {
			setToken(getActiveUserTokenHandler());
			getDataFromRemoteAPI(currentPage, getActiveUserTokenHandler());
		}
	}, [currentPage]);

	const getDataFromRemoteAPI = (cp, t) => {
		const headers = { 'Content-Type': 'application/json', Authorization: t };
		fetch(process.env.NEXT_PUBLIC_RECIPES_URL.replace('{CP}', cp), { headers })
			.then((response) => response.json())
			.then((res) => {
				setTimeout(() => {
					setData(res[0].data);
					setMeta(res[0].meta);
					setIsLoading(false);
				}, 1000); // local service is too fast for hooks
			});
	};

	const loadSpecificPageData = (e) => {
		setCurrentPage(e.target.value);
	};

	const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
		const defaultRef = React.useRef();
		const resolvedRef = ref || defaultRef;

		React.useEffect(() => {
			resolvedRef.current.indeterminate = indeterminate;
		}, [resolvedRef, indeterminate]);

		return (
			<>
				<input type='checkbox' ref={resolvedRef} {...rest} />
			</>
		);
	});

	const handleEdit = (val) => {
		console.log(JSON.stringify(val));
	};

	const columns = React.useMemo(
		() => [
			{
				Header: 'Recipes (Click on row to view details) ',
				columns: [
					// {
					// 	Header: 'ID',
					// 	accessor: '_id',
					// 	isPlaceholder: true,
					// },
					{
						Header: 'Category',
						accessor: 'category',
						isGrouped: true,
					},
					{
						Header: 'Name',
						accessor: 'name',
					},
					{
						Header: 'Description',
						accessor: 'description',
					},
					{
						Header: 'Likes',
						accessor: 'likes',
					},
					{
						Header: 'Views',
						accessor: 'views',
					},
				],
			},
		],
		[]
	);

	const getPageOptions = (totalPages) => {
		let options = [];
		for (let i = 1; i <= totalPages; i++) {
			options.push(
				<option key={i} value={i}>
					Page {i}
				</option>
			);
		}
		return options;
	};

	const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } = useTable({ columns, data, initialState: { pageIndex: 0, pageSize: 10 } }, usePagination);

	return (
		<>
			<section className='hero is-vcentered mt-5'>
				<div className='hero-body column'>
					{isLoading && (
						<progress className='progress is-small is-primary' max='100'>
							15%
						</progress>
					)}
					{!isLoading && (
						<progress className='progress is-small is-ghost' value='0' max='100'>
							0%
						</progress>
					)}
					<table {...getTableProps()} className='table is-bordered is-striped is-hoverable is-fullwidth'>
						<thead>
							{headerGroups.map((headerGroup) => (
								<tr {...headerGroup.getHeaderGroupProps()}>
									{headerGroup.headers.map((column) => (
										<th {...column.getHeaderProps()}>{column.render('Header')}</th>
									))}
								</tr>
							))}
						</thead>

						<tbody {...getTableBodyProps()}>
							{page.map((row) => {
								prepareRow(row);
								return (
									<Link key={row.original._id} href={`/recipes/${row.original._id}`}>
										<tr {...row.getRowProps()} onClick={() => handleEdit(row.original)}>
											{row.cells.map((cell) => {
												return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
											})}
										</tr>
									</Link>
								);
							})}
						</tbody>
					</table>
				</div>
			</section>
			<section className='column is-7 level ml-5 mr-5'>
				<div className='level-right'>
					<div className='level-item'>
						Showing records for page <span className='tag is-light'>{currentPage}</span>&nbsp;of&nbsp; <span className='tag is-light'>{meta?.pages}</span>
					</div>
					<div className='level-item select is-small'>
						<select onChange={loadSpecificPageData}>
							<option value='-1'>Go to Page</option>
							{getPageOptions(meta?.pages)}
						</select>
					</div>
				</div>
			</section>
		</>
	);
}
export default Recipes;

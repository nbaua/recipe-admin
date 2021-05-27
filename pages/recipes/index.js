import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { usePagination, useTable } from 'react-table';
import { useAppContext } from './../../utils/app-context';

function Recipes() {
	const { activeSession } = useAppContext();
	const router = useRouter();
	const [data, setData] = useState([]);

	useEffect(() => {
		if (activeSession === '') {
			router.push('/login');
		}

		(async () => {
			getDataFromRemoteAPI();
		})();
	}, []);

	const getDataFromRemoteAPI = () => {
		const headers = { 'Content-Type': 'application/json', Authorization: activeSession };
		fetch('http://localhost:3300/filter/recipes?page=1&limit=10', { headers })
			.then((response) => response.json())
			.then((res) => {
				setData(res[0].data);
			});
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
				Header: 'Recipes (Click on row to view details)',
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

	const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } = useTable({ columns, data, initialState: { pageIndex: 0, pageSize: 10 } }, usePagination);

	return (
		<section className='hero is-vcentered mt-5'>
			<div className='hero-body column'>
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
								<Link href={`/recipes/${row.original._id}`}>
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
	);
}
export default Recipes;

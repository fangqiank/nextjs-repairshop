'use client'

import { type TicketSearchResultType } from '@/lib/queries/getTicket'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import {ColumnFiltersState, createColumnHelper, flexRender, getCoreRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable} from '@tanstack/react-table'
import { Button } from './ui/button'
import { ArrowDown, ArrowUp, CircleCheckIcon, CircleXIcon } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Filter } from './Filter'
import { usePolling } from '@/hooks/usePolling'

type Props = {
	data: TicketSearchResultType
}

type singleType = TicketSearchResultType[0]
export const TicketTable = ({data}: Props) => {
	const router = useRouter()

	const searchParams = useSearchParams()

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

	const [sorting, setSorting] = useState<SortingState>([
		{
			id: 'ticketDate',
			desc: false
		}
	])

	usePolling(searchParams.get('searchItem'), 300000)

	const pageIndex = useMemo(() => {
		const page = searchParams.get('page')
		return page ? parseInt(page) - 1 : 0
	}, [searchParams.get('page')]) //eslint-disable-line

	const columnHeaderArray: Array<keyof singleType> = [
		"ticketDate",
		"title",
		"tech",
		"firstName",
		"lastName",
		"email",
		"completed",
	]

	const columnWidths = {
		completed: 150,
		ticketDate: 150,
		title: 250,
		tech: 225,
		email: 225
	}

	const columnHelper = createColumnHelper<singleType>()

	const columns = columnHeaderArray.map(columnName => {
		return columnHelper.accessor(row  => {
			const value = row[columnName]
			if(columnName === 'ticketDate' && value instanceof Date){
				return value.toLocaleString('en-US', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit'
				})
			}
			if(columnName === 'completed'){
				return value ? 'COMPLETED' : 'OPEN'
			}

			return value
		}, 
		{
			id: columnName,
			size: columnWidths[columnName as keyof typeof columnWidths] ?? undefined,
			header: ({column}) => {
				return (
					<Button
						variant='ghost' 
						className='pl-1 w-full flex justify-between'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						{columnName[0].toUpperCase() + columnName.slice(1)}

						{column.getIsSorted() === 'asc' && (<ArrowUp className='ml-2 h-4 w-4' />)}

						{column.getIsSorted() === 'desc' && (<ArrowDown className='ml-2 h-4 w-4' />)}

						{column.getIsSorted() !== 'desc' && column.getIsSorted() !== 'asc' && (<ArrowDown className='ml-2 h-4 w-4' />)}
					</Button>
				)
			},

			cell: ({getValue}) => {
				const value = getValue()

				if(columnName === 'completed'){
					return (
						<div className="grid place-content-center">
							{value === 'OPEN' 
							? <CircleXIcon className='opacity-25' /> 
							: <CircleCheckIcon className='text-green-600' />}
						</div>
					)
				}
				return value
			}
		})
	})

	const table = useReactTable({
		data,
		columns,
		state: {
			columnFilters,
			sorting,
			pagination: {
				pageIndex,
				pageSize: 10
			}
		},
		onColumnFiltersChange: setColumnFilters,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getSortedRowModel: getSortedRowModel(),
	})

	useEffect(() => {
		const curPageIndex = table.getState().pagination.pageIndex
		const pageCount = table.getPageCount()

		if(curPageIndex >= pageCount && curPageIndex > 0){
			const params = new URLSearchParams(searchParams.toString())
			params.set('page', '1')
			router.replace(`?${params.toString()}`, {scroll: false})
		}
	}, [table.getState().columnFilters]) //eslint-disable-line
	
	
	return (
		<div className="mt-6 flex flex-col gap-4">
			<div className="rounded-lg overflow-hidden border border-border">
				<Table className='border'>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header =>{ 
									return (
										<TableHead
											key={header.id}
											className='bg-secondary p-1'
											style={{width: header.getSize()}}
										>
											<div>
												{header.isPlaceholder 
													? null 
													: flexRender(
														header.column.columnDef.header, 
														header.getContext()
													)}
											</div>
											
											{
												header.column.getCanFilter() 
												? (
														<div className='grid place-content-center'>
															<Filter 
																column={header.column} 
																filteredRows={table.getFilteredRowModel().rows.map(row => row.getValue(header.column.id))}
															/>
														</div>
													) 
												: null
											}
										</TableHead>
								)})}
							</TableRow>
						))}
					</TableHeader>

					<TableBody>
						{table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								className="cursor-pointer hover:bg-border/25 dark:hover:bg-ring/40"
								onClick={() => router.push(`/tickets/form?ticketId=${row.original.id}`)}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id} className="border">
										{flexRender(
											cell.column.columnDef.cell,
											cell.getContext()
										)}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
	
			<div className="flex justify-between items-center gap-1 flex-wrap">
				<div>
					<p className="font-bold whitespace-nowrap">
						{`Page ${table.getState().pagination.pageIndex + 1} of ${Math.max(1, table.getPageCount())}`}
						&nbsp;
						&nbsp;
						{`[${table.getFilteredRowModel().rows.length} ${table.getFilteredRowModel().rows.length !== 1 
							? 'total results' 
							: 'result'}]`}
					</p>
				</div>

        <div className='flex flex-row gap-1'>
					<div className="flex flex-row gap-1">
						<Button 
							variant='outline'
							onClick={() => router.refresh()}
						>
							Refresh Data
						</Button>

						<Button 
							variant='outline'
							onClick={() => table.resetSorting()}
						>
							Reset Sorting
						</Button>

						<Button 
							variant='outline'
							onClick={() => table.resetColumnFilters()}
						>
							Reset Filters
						</Button>
					</div>

					<div className='flex flex-row gap-1'>
						<Button 
							variant='outline'
							// onClick={() => table.previousPage()}
							onClick={() => {
								const newIndex = table.getState().pagination.pageIndex - 1
								table.setPageIndex(newIndex)
								const params = new URLSearchParams(searchParams.toString())
								params.set('page', (newIndex + 1).toString())
								router.replace(`?${params.toString()}`, {scroll: false})
							}}
							disabled={!table.getCanPreviousPage()}
						>
							Previous
						</Button>

						<Button 
							variant='outline'
							// onClick={() => table.nextPage()}
							onClick={() => {
								const newIndex = table.getState().pagination.pageIndex + 1
								table.setPageIndex(newIndex)
								const params = new URLSearchParams(searchParams.toString())
								params.set('page', (newIndex + 1).toString())
								router.replace(`?${params.toString()}`, {scroll: false})
							}}
							disabled={!table.getCanNextPage()}
						>
							Next
						</Button>
					</div>
				</div>
			</div>
		</div>
)}
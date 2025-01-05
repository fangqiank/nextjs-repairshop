'use client'

import { type selectCustomerSchemaType } from '@/schemas/customer'
import { CellContext, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Button } from './ui/button'
import { MoreHorizontal, TableOfContents } from 'lucide-react'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from './ui/dropdown-menu'
import Link from 'next/link'


type Props = {
	data: selectCustomerSchemaType[]
}

export const CustomerTable = ({data}: Props) => {
	// const router = useRouter()	

	const columnHeader: Array<keyof selectCustomerSchemaType> = [
		"firstName",
		"lastName",
		"email",
		"phone",
		"city",
		"zip",
	]

	const columnHelper = createColumnHelper<selectCustomerSchemaType>()

	const ActionCell = ({row}: CellContext<selectCustomerSchemaType, unknown>) => {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='ghost'
						className='h-8 w-8 p-0'
					>
						<span className='sr-only'>Open menu</span>
						<MoreHorizontal className='w-4 h-4' />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align='end'>
					<DropdownMenuLabel>Action</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<Link 
							href={`/tickets/form?customerId=${row.original.id}`}
							className='w-full'
							prefetch={false}
						>
							New Ticket
						</Link>
					</DropdownMenuItem>

					<DropdownMenuItem>
						<Link 
							href={`/customers/form?customerId=${row.original.id}`}
							className='w-full'
							prefetch={false}
						>
							Edit Customer
						</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		)
	}

	ActionCell.displayName = 'ActionCell'

	// const columns = columnHeader.map(column => columnHelper.accessor(column, {
	// 	id: column,
	// 	header: column[0].toUpperCase() + column.slice(1),
	// }))
	const columns = [
		columnHelper.display({
			id: 'Actions',
			header: () => <TableOfContents />,
			cell: ActionCell
		}),
		...columnHeader.map(column => columnHelper.accessor(column, {
			id: column,
			header: column[0].toUpperCase() + column.slice(1),
		}))
	]

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	return (
		<div className='mt-6 rounded-lg overflow-hidden border border-border'>
			<Table className='border'>
				<TableHeader>
					{table.getHeaderGroups().map(headerGroup => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map(header => (
								<TableHead 
									key={header.id}
									className={`bg-secondary ${header.id === 'Actions' ? 'w-12' : ''}`}
								>
									<div className={`${header.id === 'Actions' ? 'flex justify-center items-center' : ''}`}>
										{header.isPlaceholder ? null : flexRender(
											header.column.columnDef.header, 
											header.getContext()
										)}
									</div>
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>

				<TableBody>
					{table.getRowModel().rows.map(row => (
						<TableRow 
							key={row.id}
							className='cursor-pointer hover:bg-border/25 dark:bg-ring/40' 
							// onClick={() => router.push(`/customers/form?customerId=${row.original.id}`)}
						>
							{row.getVisibleCells().map(cell => (
								<TableCell 
									key={cell.id}
									className='border'
								>
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
	)
}
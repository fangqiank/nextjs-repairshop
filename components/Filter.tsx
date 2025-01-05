import { Column } from '@tanstack/react-table'
import React from 'react'
import { DebounceInput } from './DebounceInput'

type Props<T> = {
	column: Column<T, unknown>,
	filteredRows: string[]
}

export const Filter = <T,>({ column, filteredRows }: Props<T>) => {
	const columnFilterValue = column.getFilterValue()

	const uniqueFilteredValues = new Set(filteredRows)

	const sortedUnqiueValue = Array.from(
		// column.getFacetedUniqueValues().keys()
		uniqueFilteredValues
	).sort()

	return (
		<>
			<datalist id={column.id + 'list'}>
				{sortedUnqiueValue.map((value, i) => (
					<option 
						value={value} 
						key={`${i}-${column.id}`} 
					/>
				))}
			</datalist>
				
			<DebounceInput
				type='text'
				value={(columnFilterValue ?? '') as string}
				// placeholder={`Search...(${[...column.getFacetedUniqueValues()]
					// .filter(x => x[0].length)}`}
				placeholder={`Search...(${uniqueFilteredValues.size})`}
				className='w-full border shadow rounded bg-card'
				onChange={value => column.setFilterValue(value)}
				list={column.id + 'list'}
			/>
		</>
	)
}


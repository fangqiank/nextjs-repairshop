'use client'

import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

type Props<T> = {
	fieldTitle: string,
	nameInSchema: keyof T & string,
	data: {
		id: string,
		description: string
	}[],
	className?: string,
}

export const SelectWithLabel = <T,>({
	fieldTitle,
	nameInSchema,
	className,
	data
}: Props<T>) => {
	const form = useFormContext()

	return (
		<FormField
			control={form.control}
			name={nameInSchema}
			render={({ field }) => (
				<FormItem>
					<FormLabel
						className="text-base"
						htmlFor={nameInSchema}
					>
						{fieldTitle}
					</FormLabel>
					
					<Select
						{...field}
						onValueChange={field.onChange}
					>
						<FormControl>
							<SelectTrigger
								id={nameInSchema}
								className={`w-full max-w-xs ${className}`}
							>
								<SelectValue placeholder='Select' />
							</SelectTrigger>
						</FormControl>

						<SelectContent>
							{data.map(item => (
								<SelectItem
									key={`${nameInSchema}-${item.id}}`}
									value={item.id}
								>
									{item.description}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
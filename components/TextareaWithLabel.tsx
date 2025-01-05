'use client'

import React, { TextareaHTMLAttributes } from 'react'
import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Textarea } from './ui/textarea'
	
	type Props<T> = {
		fieldTitle: string,
    nameInSchema: keyof T & string,
    className?: string,
	} & TextareaHTMLAttributes<HTMLTextAreaElement>
	
	export const TextareaWithLabel = <T,>({
		fieldTitle,
		nameInSchema,
		className,
		...props
	}: Props<T>) => {
		const form = useFormContext()

		return (
			<FormField
				control={form.control}
				name={nameInSchema}
				render={({ field }) => (
					<FormItem>
						<FormLabel
								className="text-base mb-2"
								htmlFor={nameInSchema}
						>
							{fieldTitle}
						</FormLabel>

						<FormControl>
							<Textarea
									id={nameInSchema}
									className={`disabled:text-blue-500 dark:disabled:text-gray-500 disabled:opacity-75 ${className}`}
									{...props}
									{...field}
							/>
						</FormControl>

						<FormMessage />
					</FormItem>
        )}
      />
		)
	}					
import React, { InputHTMLAttributes, useEffect } from 'react'
import { Input } from './ui/input'

type DebounceInputProps = {
	value: string,
	onChange: (value: string | number) => void,
	debounce?: number,
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>

export const DebounceInput = ({ value: initiaValue, onChange, debounce, ...rest }: DebounceInputProps) => {
	const [value, setValue] = React.useState(initiaValue)

	useEffect(() => {
		setValue(initiaValue)
	}, [initiaValue])

	useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value)
		}, debounce)
	
		return () => {
			clearTimeout(timeout)
		}
	}, [value, debounce]) //eslint-disable-line
	
	return (
		<Input
			{...rest}
			value={value}
			onChange={e => setValue(e.target.value)}
		/>
	)
}
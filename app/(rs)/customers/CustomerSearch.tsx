import Form from 'next/form'
import { Input } from '@/components/ui/input'
import { SearchButton } from '@/components/SearchButton'
export const CustomerSearch = () => {
	return (
		<Form
			action='/customers'
			className='flex gap-2 items-center'
		>
			<Input 
				name='searchItem'
				type='text'
				placeholder='Search Customers'
				className='w-full'
				autoFocus
			/>
			<SearchButton />	
		</Form>
	)
}
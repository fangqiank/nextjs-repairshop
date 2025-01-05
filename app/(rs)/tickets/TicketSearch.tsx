import { SearchButton } from "@/components/SearchButton"
import { Input } from "@/components/ui/input"
import Form from "next/form"

export const TicketSearch = () => {
	return (
		<Form 
			action='/tickets'
			className="flex gap-2 items-center"
		>
			<Input
				name="searchItem"
				type="text"
				placeholder="Search Tickets"
				className="w-full" 
				autoFocus
			/>
			<SearchButton />
		</Form>
	)
}
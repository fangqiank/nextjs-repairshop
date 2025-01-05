import { getTicketSearchResults } from "@/lib/queries/getTicketSearchResults"
import { TicketSearch } from "./TicketSearch"
import { getOpenTickets } from "@/lib/queries/getOpenTickets"
import { TicketTable } from "@/components/TicketTable"

export const metadata = {
	title: "Tickets Search",
}

type Props = {
	searchParams: Promise<{ [key: string]: string | undefined}>
}
const TicketsPage = async ({searchParams}:Props) => {
	const {searchItem} = await searchParams

	if(!searchItem){
		const results = await getOpenTickets()
		return (
			<>
				<TicketSearch />
				{/* <p>{JSON.stringify(results)}</p> */}
				{results.length 
					? <TicketTable data={results} /> 
					: <p className="mt-4">No open tickets found</p>}
			</	>
		)		
	}

	const results = await getTicketSearchResults(searchItem)

	return (
		<>
			<TicketSearch />
			{/* <p>{JSON.stringify(results)}</p> */}
			{results.length 
				? <TicketTable data={results} /> 			
				: <p className="mt-4">No results found</p>}
		</>
	)
}

export default TicketsPage
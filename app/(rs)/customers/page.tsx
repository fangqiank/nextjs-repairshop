import { getCustomerSearchResults } from "@/lib/queries/getCustomerSearchResults"
import { CustomerSearch } from "./CustomerSearch"
import * as Sentry from '@sentry/nextjs'
import { CustomerTable } from "@/components/CustomerTable"

export const metadata = {
	title: "Customer Search",
}

type Props = {
	searchParams: Promise<{ [key: string]: string | undefined}>
}
const CustomersPage = async ({searchParams}: Props) => {
	const {searchItem} = await searchParams

	// console.log('searchItem: ', searchItem)
				
	if(!searchItem)
		return <CustomerSearch />

	const span = Sentry.startInactiveSpan({ 
		name: 'getCustomerSearchResults-2', 
		op: 'query' 
	})

	const results = await getCustomerSearchResults(searchItem)
	span.end()

	return (
		<>
			<CustomerSearch />
			{/* <p>{JSON.stringify(results)}</p> */}
			{
				results.length 
					? <CustomerTable data={results} /> 
					: <p className="mt-4">No results found</p>
			}
		</>
	)
}

export default CustomersPage
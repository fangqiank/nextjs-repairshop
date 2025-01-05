import { BackButton } from '@/components/BackButton';
import { getCustomer } from '@/lib/queries/getCustomer';
import { getTicket } from '@/lib/queries/getTicket';
import React from 'react'
import * as Sentry from "@sentry/nextjs"
import { TicketForm } from '@/components/TicketForm';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {Users, init} from '@kinde/management-api-js'

type Props = {
	searchParams: Promise<{[key: string]: string | undefined}>;
}

export const generateMetadata = async ({
	searchParams,
}: Props) => {
	const { customerId, ticketId } = await searchParams

	if (!customerId && !ticketId) return {
			title: 'Missing Ticket ID or Customer ID'
	}

	if (customerId) return {
			title: `New Ticket for Customer #${customerId}`
	}

	if (ticketId) return {
			title: `Edit Ticket #${ticketId}`
	}
}

const TicketFormPage = async ({searchParams}: Props) => {
	try {
		const {customerId, ticketId} = await searchParams

		const {getPermission, getUser} = getKindeServerSession()
		const [managerPermission, user] = await Promise.all([
			getPermission('manager'),
			getUser()
		])
    const isManager = managerPermission?.isGranted

		if(!customerId && !ticketId){
			return (
				<>
					<h2 className="text-2xl mb-2">Ticket ID or Customer ID required to load ticket form</h2>
					<BackButton title="Go Back" variant="default" />`
				</>
			)
		}

		if(customerId){
			const customer = await getCustomer(Number(customerId))

			if(!customer){
				return (
					<>
						<h2 className="text-2xl mb-2">Customer ID #{customerId} not found</h2>
						<BackButton title="Go Back" variant="default" />
					</>
				)
			}

			if(!customer.active){
				return (
					<>
						<h2 className="text-2xl mb-2">Customer ID #{customerId} is not active.</h2>
						
						<BackButton 
							title="Go Back" 
							variant="default" 
						/>
					</>
				)
			}

			// console.log(customer);

			if(isManager){
				init()

				const {users} = await Users.getUsers()

				// const techs = users ? users.map(user => ({ id: user.email?.toLowerCase()!, description: user.email?.toLowerCase()! })) : []
				const techs = users?.filter(user => user.email).map(user => {
					const email = user.email!.toLowerCase(); // Safe because of the filter
					return { id: email, description: email };
				}) || [];

				return <TicketForm 
					customer={customer} 
					techs={techs}
					isManager={isManager}
				/>
			} else {
				return <TicketForm customer={customer} />
			}
			
		}
		
		if(ticketId){
			const ticket = await getTicket(Number(ticketId))

			if(!ticket){
				return(
					<>
						<h2 className="text-2xl mb-2">Ticket ID #{ticketId} not found</h2>
						<BackButton 
							title="Go Back" 
							variant="default" 
						/>
					</>
				)
			}

			const customer = await getCustomer(ticket.customerId)

			// console.log(ticket, customer);
			if(isManager){
				init()

				const {users} = await Users.getUsers()

				const techs = users ? users.map(user => ({id: user.email!, description: user.email!})) : []

				return <TicketForm 
					customer={customer} 
					ticket={ticket}
					techs={techs}
					isManager={isManager}
				/>
			} else{
				return <TicketForm 
					customer={customer} 
					ticket={ticket}
					isEditable={user.email?.toLowerCase() === ticket.tech.toLowerCase()} 
				/>
			}
		}
	} catch (error) {
		if(error instanceof Error){
			Sentry.captureException(error)
			throw error
		}
	}
	
}

export default TicketFormPage
import { BackButton } from '@/components/BackButton';
import { getCustomer } from '@/lib/queries/getCustomer';
import React from 'react'

import * as Sentry from "@sentry/nextjs"
import { CustomerForm } from '@/components/CustomerForm';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

type Props = {
	searchParams: Promise<{[key: string]: string | undefined}>;
}

export const generateMetadata = async ({searchParams}: Props) => {
	const {customerId} = await searchParams

	if(!customerId)
		return {title: 'New Customer'}

	return  {title: `Edit Customer ID ${customerId}`}
}

const CustomerFormPage = async ({searchParams}: Props) => {
	try {
		const {getPermission} = getKindeServerSession()
		const managerPermission = await getPermission('manager')
		const isManger = managerPermission?.isGranted

		const {customerId} = await searchParams

		if(customerId){
			const customer = await getCustomer(Number(customerId))

			if(!customer){
				return (
					<>
						<h2 className='text-2xl mb-2'>Customer ID #{customerId} not found</h2>
						
						<BackButton 
							title='Go back'
							variant='default'
						/>
					</>
				)
			}

			// console.log(customer)

			return<CustomerForm
				key={customerId} 
				isManager={isManger}
				customer={customer} 
			/>
		}else{
			return <CustomerForm
				key={customerId} 
				isManager={isManger}
			/>
		}
		
	} catch (error) {
		if (error instanceof Error) {
			Sentry.captureException(error);
			throw error;
		}
	}		
}

export default CustomerFormPage;


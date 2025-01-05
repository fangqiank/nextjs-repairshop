'use client'

import { insertCustomerSchema, type insertCustomerSchemaType, type selectCustomerSchemaType } from "@/schemas/customer"
import {zodResolver} from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import { Form } from "./ui/form"
import { InputWithLabel } from "./InputWithLabel"
import { Button } from "./ui/button"
import { SelectWithLabel } from "./SelectWithLabel"
import { TextareaWithLabel } from "./TextareaWithLabel"
import { CheckboxWithLabel } from "./CheckboxWithLabel"
import {useAction} from 'next-safe-action/hooks'
import { saveCustomerAction } from "@/app/actions/saveCustomerAction"
import { useToast } from "@/hooks/use-toast"
import { LoaderCircle } from "lucide-react"
import { DisplayServerActionResponse } from "./DisplayServerActionResponse"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

type Props = {
	customer?: selectCustomerSchemaType,
	isManager?: boolean | undefined
}

export const stateArray = [
	{ id: "AL", description: "Alabama" },
	{ id: "AK", description: "Alaska" },
	{ id: "AZ", description: "Arizona" },
	{ id: "AR", description: "Arkansas" },
	{ id: "CA", description: "California" },
	{ id: "CO", description: "Colorado" },
	{ id: "CT", description: "Connecticut" },
	{ id: "DE", description: "Delaware" },
	{ id: "DC", description: "District of Columbia" },
	{ id: "FL", description: "Florida" },
	{ id: "GA", description: "Georgia" },
	{ id: "HI", description: "Hawaii" },
	{ id: "ID", description: "Idaho" },
	{ id: "IL", description: "Illinois" },
	{ id: "IN", description: "Indiana" },
	{ id: "IA", description: "Iowa" },
	{ id: "KS", description: "Kansas" },
	{ id: "KY", description: "Kentucky" },
	{ id: "LA", description: "Louisiana" },
	{ id: "ME", description: "Maine" },
	{ id: "MD", description: "Maryland" },
	{ id: "MA", description: "Massachusetts" },
	{ id: "MI", description: "Michigan" },
	{ id: "MN", description: "Minnesota" },
	{ id: "MS", description: "Mississippi" },
	{ id: "MO", description: "Missouri" },
	{ id: "MT", description: "Montana" },
	{ id: "NE", description: "Nebraska" },
	{ id: "NV", description: "Nevada" },
	{ id: "NH", description: "New Hampshire" },
	{ id: "NJ", description: "New Jersey" },
	{ id: "NM", description: "New Mexico" },
	{ id: "NY", description: "New York" },
	{ id: "NC", description: "North Carolina" },
	{ id: "ND", description: "North Dakota" },
	{ id: "OH", description: "Ohio" },
	{ id: "OK", description: "Oklahoma" },
	{ id: "OR", description: "Oregon" },
	{ id: "PA", description: "Pennsylvania" },
	{ id: "RI", description: "Rhode Island" },
	{ id: "SC", description: "South Carolina" },
	{ id: "SD", description: "South Dakota" },
	{ id: "TN", description: "Tennessee" },
	{ id: "TX", description: "Texas" },
	{ id: "UT", description: "Utah" },
	{ id: "VT", description: "Vermont" },
	{ id: "VA", description: "Virginia" },
	{ id: "WA", description: "Washington" },
	{ id: "WV", description: "West Virginia" },
	{ id: "WI", description: "Wisconsin" },
	{ id: "WY", description: "Wyoming" },
	{ id: "AS", description: "American Samoa" },
	{ id: "GU", description: "Guam" },
	{ id: "MP", description: "Northern Mariana Islands" },
	{ id: "PR", description: "Puerto Rico" },
	{ id: "VI", description: "U.S. Virgin Islands" },
	{ id: "FM", description: "Federated States of Micronesia" },
	{ id: "MH", description: "Marshall Islands" },
	{ id: "PW", description: "Palau" }
]

export const CustomerForm = ({customer, isManager=false}: Props) => {
	// const {getPermission, getPermissions, isLoading} = useKindeBrowserClient()

	// const isManager = !isLoading && getPermission('manager')?.isGranted

	// const permissions = getPermissions()
	// console.log(permissions);
	// const isAuthorized = !isLoading && permissions.permissions.some(x => x === 'manager' || x === 'admin')

	const { toast } = useToast()

	const searchParams = useSearchParams()
	const hasCustomerId = searchParams.has('customerId')
	
	const emptyValues: insertCustomerSchemaType = {
		id: 0,
		firstName: '',
		lastName: '',
		address1: '',
		address2: '',
		city: '',
		state: '',
		zip: '',
		phone: '',
		email: '',
		notes: '',
		active: true,
  }

	const defaultValues: insertCustomerSchemaType = hasCustomerId ? {
		id: customer?.id ?? 0,
		firstName: customer?.firstName ?? '',
		lastName: customer?.lastName ?? '',
		address1: customer?.address1 ?? '',
		address2: customer?.address2 ?? '',
		city: customer?.city ?? '',
		state: customer?.state ?? '',
		zip: customer?.zip ?? '',
		phone: customer?.phone ?? '',
		email: customer?.email ?? '',
		notes: customer?.notes ?? '',
		active: customer?.active ?? true
	} : emptyValues

	const form = useForm<insertCustomerSchemaType>({
		mode: 'onBlur',
		resolver: zodResolver(insertCustomerSchema),
		defaultValues
	})

	useEffect(() => {
		form.reset(hasCustomerId ? defaultValues : emptyValues)
	}, [searchParams.get('customerId')]) //eslint-disable-line 

	const {
		execute : executeSave,
		result: saveResult,
		isExecuting: isSaving,
		reset: resetSaveAction
	} = useAction(saveCustomerAction, {
		onSuccess({data}) {
			if(data?.message){
				toast({
					variant: "default",
					title: "Success! 🎉",
					description: data.message,
				})
			}
		},

		onError({error}) {
			console.log(error)
			toast({
				variant: "destructive",
				title: "Error",
				description: "Save Failed",
		  })
		}
})

	const handleSubmit = async (data: insertCustomerSchemaType) => {
		executeSave(data)
	}

	return (
		<div className="flex flex-col gap-1 sm:px-8">
			<DisplayServerActionResponse result={saveResult} />
			<div>
				<h2 className="text-2xl font-bold">
					{customer?.id ? 'Existed' : 'New'} Customer {customer?.id ? `#${customer.id}` : 'Form'}
				</h2>
			</div>

			<Form {...form}>
				<form 
					className="flex flex-col sm:flex-row gap-4 sm:gap-8"
					onSubmit={form.handleSubmit(handleSubmit)}
				>
					<div className="flex flex-col gap-4 w-full max-w-xs">
						<InputWithLabel<insertCustomerSchemaType>
							fieldTitle="First Name"							
							nameInSchema='firstName'
						/>

						<InputWithLabel<insertCustomerSchemaType>
							fieldTitle="Last Name"							
							nameInSchema='lastName'
						/>

						<InputWithLabel<insertCustomerSchemaType>
							fieldTitle="Address 1"							
							nameInSchema='address1'
						/>

						<InputWithLabel<insertCustomerSchemaType>
							fieldTitle="Address 2"							
							nameInSchema='address2'
						/>							
							
						<InputWithLabel<insertCustomerSchemaType>
							fieldTitle="City"							
							nameInSchema='city'
						/>

						<SelectWithLabel<insertCustomerSchemaType>
							fieldTitle="State"							
							nameInSchema='state'
							data={stateArray}
						/>
					</div>

					<div className="flex flex-col gap-4 w-full max-w-xs">
						<InputWithLabel<insertCustomerSchemaType>
							fieldTitle="Zip Code"							
							nameInSchema='zip'
						/>
						
						<InputWithLabel<insertCustomerSchemaType>
							fieldTitle="Email"							
							nameInSchema='email'
						/>
						
						<InputWithLabel<insertCustomerSchemaType>
							fieldTitle="Phone"							
							nameInSchema='phone'
						/>

						<TextareaWithLabel<insertCustomerSchemaType>
							fieldTitle="Notes"							
							nameInSchema='notes'
							className='h-40'
						/>

						{isManager && customer?.id ? (
							<CheckboxWithLabel<insertCustomerSchemaType>
								fieldTitle="Active"							
								nameInSchema='active'
								message="Yes"
							/>
						) : null}

						<div className='flex gap-2'>
							<Button
								className="w-3/4"
								variant='default'
								type='submit'
								title="save"
								disabled={isSaving}
							>
								{isSaving ? (
										<>
											<LoaderCircle className="animate-spin"/>
										</>
									) : 'Save'}
							</Button>

							<Button
								variant='destructive'
								type='button'
								title="Reset"
								onClick={() => {
									form.reset(defaultValues)
									resetSaveAction()
								}}
							>
								Reset
							</Button>
						</div>
					</div>
					{/* <p>{JSON.stringify(form.getValues())}</p> */}
				</form>
			</Form>
		</div>
	)
}
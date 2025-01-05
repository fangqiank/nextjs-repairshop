'use client'

import { selectCustomerSchemaType } from "@/schemas/customer"
import { insertTicketSchema, insertTicketSchemaType, selectTicketSchemaType } from "@/schemas/ticket"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form } from "./ui/form"
import { InputWithLabel } from "./InputWithLabel"
import { CheckboxWithLabel } from "./CheckboxWithLabel"
import { Button } from "./ui/button"
import { TextareaWithLabel } from "./TextareaWithLabel"
import { SelectWithLabel } from "./SelectWithLabel"
import { useToast } from "@/hooks/use-toast"
import { useAction } from "next-safe-action/hooks"
import { saveTicketAction } from "@/app/actions/saveTicketAction"
import { LoaderCircle } from "lucide-react"
import { DisplayServerActionResponse } from "./DisplayServerActionResponse"

type Props = {
	customer: selectCustomerSchemaType,
	ticket?: selectTicketSchemaType,
	techs?: {
		id: string,
		description: string
	}[],
	isEditable?: boolean,
	isManager?: boolean | undefined
}

export const TicketForm = ({customer, ticket, techs, isEditable = true, isManager = false}: Props) => {
	const defaultValues: insertTicketSchemaType = {
		id: ticket?.id ?? "(new)",
		customerId: ticket?.customerId ?? customer.id,
		title: ticket?.title ?? '',
		description: ticket?.description ?? '',
		completed: ticket?.completed ?? false,
		tech: ticket?.tech.toLowerCase() ?? 'new-ticket@example.com',
		
	}

	// const isManager = Array.isArray(techs)

	const {toast} = useToast()

	const form = useForm<insertTicketSchemaType>({
		mode: 'onBlur',
		resolver: zodResolver(insertTicketSchema),
		defaultValues
	})

	const {
		execute: execuseSave,
		result: saveResult,
		isPending: isSaving,
		reset: resetSaveAction
	} = useAction(saveTicketAction, {
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

	const handleSubmit = async (data: insertTicketSchemaType) => {
		// console.log(data)
		execuseSave(data)
	}

	return (
		<div className="flex flex-col gap-1 sm:px-8">
			<DisplayServerActionResponse result={saveResult}/>
			<div>
				<h2 className="text-2xl font-bold">
					{ticket?.id && isEditable 
					? `Existed Ticket 		#${ticket.id}` 
					: ticket?.id 
						? `View Ticket #${ticket.id}` 
						: 'New Ticket'} 
				</h2>
			</div>

			<Form {...form}>
				<form
					className="flex flex-col sm:flex-row gap-4 sm:gap-8"
					onSubmit={form.handleSubmit(handleSubmit)}
				>
					<div className="flex flex-col gap-4 w-full max-w-xs">
						<InputWithLabel<insertTicketSchemaType>
								fieldTitle="Title"
								nameInSchema="title"
								disabled={!isEditable}
						/>

					{isManager && techs ? (
						<SelectWithLabel<insertTicketSchemaType>
							fieldTitle="Tech ID"
							nameInSchema="tech"
							data={[
								{
									id: 'new-ticket@example.com', 
								  description: 'new-ticket@example.com'
								},
								...techs
							]}
						/>
		       ) : (
						<InputWithLabel<insertTicketSchemaType>
								fieldTitle="Tech"
								nameInSchema="tech"
								disabled={true}
						/>
					 )}		
						
					{ticket?.id ? (
						<CheckboxWithLabel<insertTicketSchemaType>
							fieldTitle="Completed"
							nameInSchema="completed"
							message="Yes"
							disabled={!isEditable}
						/>
					) : null}
					
					<div className="mt-4 space-y-2">
						<h3 className="text-lg">Customer Info</h3>
						<hr className="w-4/5" />	
						<p>{customer.firstName} {customer.lastName}</p>
						<p>{customer.address1}</p>
							{customer.address2 ? <p>{customer.address2}</p> : null}
						<p>{customer.city}, {customer.state} {customer.zip}</p>
						<hr className="w-4/5" />
						<p>{customer.email}</p>
						<p>Phone: {customer.phone}</p>
					</div>
			   </div>

				 <div className="flex flex-col gap-4 w-full max-w-xs">
					<TextareaWithLabel<insertTicketSchemaType>
							fieldTitle="Description"
							nameInSchema="description"
							className="h-96"
							disabled={!isEditable}
					/>

					<div className="flex gap-2">
						<Button
								type="submit"
								className="w-3/4"
								variant="default"
								title="Save"
								disabled={isSaving}
						>
								{isSaving ? (
										<>
											<LoaderCircle className="animate-spin" /> Saving
										</>
								) : "Save"}
						</Button>

						<Button
								type="button"
								variant="destructive"
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
"use server";

import {actionClient} from "@/lib/safe-action";
import {
  insertTicketSchema,
  type insertTicketSchemaType,
} from "@/schemas/ticket";
import {flattenValidationErrors} from "next-safe-action";
import {tickets} from "@/db/schema";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {redirect} from "next/navigation";
import {db} from "@/db";
import {eq} from "drizzle-orm";

export const saveTicketAction = actionClient
  .metadata({actionName: "saveTicketAction"})
  .schema(insertTicketSchema, {
    handleValidationErrorsShape: async (v) =>
      flattenValidationErrors(v).fieldErrors,
  })
  .action(
    async ({parsedInput: ticket}: {parsedInput: insertTicketSchemaType}) => {
      const {isAuthenticated} = getKindeServerSession();

      const isAuth = await isAuthenticated();

      if (!isAuth) redirect("/login");

      if (ticket.id === "(new)") {
        const result = await db
          .insert(tickets)
          .values({
            title: ticket.title,
            description: ticket.description,
            customerId: ticket.customerId,
            tech: ticket.tech,
          })
          .returning({insertedId: tickets.id});

        return {
          message: `Ticket ID #${result[0].insertedId} created successfully`,
        };
      }

      const result = await db
        .update(tickets)
        .set({
          title: ticket.title,
          description: ticket.description,
          customerId: ticket.customerId,
          tech: ticket.tech,
          completed: ticket.completed,
        })
        .where(eq(tickets.id, ticket.id!))
        .returning({updatedId: tickets.id});

      return {message: `Ticket ID #${result[0].updatedId}updated successfully`};
    }
  );

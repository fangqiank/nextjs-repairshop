import {db} from "@/db";
import {customers, tickets} from "@/db/schema";
import {eq, ilike, or, sql, asc} from "drizzle-orm";

export const getTicket = async (id: number) => {
  const ticket = await db.select().from(tickets).where(eq(tickets.id, id));

  return ticket[0];
};

export const getTicketSearchResult = async (searchItem: string) => {
  const result = await db
    .select({
      id: tickets.id,
      ticketDate: tickets.createdAt,
      title: tickets.title,
      firstName: customers.firstName,
      lastName: customers.lastName,
      email: customers.email,
      tech: tickets.tech,
      completed: tickets.completed,
    })
    .from(tickets)
    .leftJoin(customers, eq(tickets.customerId, customers.id))
    .where(
      or(
        ilike(tickets.title, `%${searchItem}%`),
        ilike(tickets.tech, `%${searchItem}%`),
        ilike(customers.email, `%${searchItem}%`),
        ilike(customers.phone, `%${searchItem}%`),
        ilike(customers.city, `%${searchItem}%`),
        ilike(customers.zip, `%${searchItem}%`),
        sql`lower(concat(${customers.firstName}, ' ', ${
          customers.lastName
        })) like ${`%${searchItem.toLowerCase().replace(" ", "%")}%`}`
      )
    )
    .orderBy(asc(tickets.createdAt));

  return result;
};

export type TicketSearchResultType = Awaited<
  ReturnType<typeof getTicketSearchResult>
>;

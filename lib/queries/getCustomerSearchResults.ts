import {db} from "@/db";
import {customers} from "@/db/schema";
import {ilike, or, sql} from "drizzle-orm";

export const getCustomerSearchResults = async (searchItem: string) => {
  const results = await db
    .select()
    .from(customers)
    .where(
      or(
        // ilike(customers.firstName, `%${searchItem}%`),
        // ilike(customers.lastName, `%${searchItem}%`),
        ilike(customers.email, `%${searchItem}%`),
        ilike(customers.phone, `%${searchItem}%`),
        // ilike(customers.address1, `%${searchItem}%`),
        // ilike(customers.address2, `%${searchItem}%`),
        ilike(customers.city, `%${searchItem}%`),
        // ilike(customers.state, `%${searchItem}%`),
        ilike(customers.zip, `%$searchItem}%`),
        // ilike(customers.notes, `%${searchItem}%`)
        sql`lower(concat(${customers.firstName}, ' ', ${
          customers.lastName
        })) LIKE ${`%${searchItem.toLowerCase().replace(" ", "%")}%`}`
      )
    ).orderBy(
      customers.lastName
    );

  return results;
};

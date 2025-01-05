import {createInsertSchema, createSelectSchema} from "drizzle-zod";
import {customers} from "@/db/schema";

export const insertCustomerSchema = createInsertSchema(customers, {
  firstName: (s) => s.firstName.min(1, "first name is required"),
  lastName: (s) => s.lastName.min(1, "Last name is required"),
  address1: (s) => s.address1.min(1, "Address is required"),
  city: (s) => s.city.min(1, "City is required"),
  state: (s) => s.state.length(2, "State must be exactly 2 characters"),
  email: (s) => s.email.email("Invalid email address"),
  zip: (s) =>
    s.zip.regex(
      /^\d{5}(-\d{4})?$/,
      "Invalid Zip code. Use 5 digits or 5 digits followed by a hyphen and 4 digits"
    ),
  phone: (s) =>
    s.phone.regex(
      /^\d{3}-\d{3}-\d{4}$/,
      "Invalid phone number format. Use XXX-XXX-XXXX"
    ),
});

export const selectCustomerSchema = createSelectSchema(customers);

export type insertCustomerSchemaType = typeof insertCustomerSchema._type;

export type selectCustomerSchemaType = typeof selectCustomerSchema._type;

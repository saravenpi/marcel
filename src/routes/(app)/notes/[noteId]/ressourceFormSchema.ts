import { z } from "zod";

export const formSchema = z.object({
	type: z.string({ required_error: "Please select a type" }),
	name: z.string({ required_error: "Please enter a name" }),
});

export type FormSchema = typeof formSchema;

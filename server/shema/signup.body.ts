import { z } from "zod";

const signupBodySchema = z.object({
    login: z.string().trim().min(1, "login required"),
    password: z.string().min(6).max(72),
    email: z.string().trim().toLowerCase().pipe(z.email()),
    name: z.string().trim().min(1, "name required"),
});

type SignupBody = z.infer<typeof signupBodySchema>;
export type { SignupBody };
export default signupBodySchema;


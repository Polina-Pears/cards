import { z } from "zod";

const signinBodySchema = z.object({
    login: z.string().trim().min(1, "login required"),
    password: z.string().trim().min(1, "password required"),
});

type SigninBody = z.infer<typeof signinBodySchema>;
export type { SigninBody };
export default signinBodySchema;


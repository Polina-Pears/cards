import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { hashPassword } from "../utils/hashPassword";
import Profile from "../models/profile";
import { SignupBody } from "../shema/signup.body";

export const signupHandler = async (
        request: FastifyRequest<{ Body: SignupBody }>,
        reply: FastifyReply
    ) => {
        
    const { login, password, email, name } = request.body 
    const profileModel = new Profile(request.server.pg);

    try {

        // Проверяем, существует ли пользователь с таким логином или email
        const existingLogin = await profileModel.existsByLogin(login);
        if (existingLogin)
            return reply
                .status(409)
                .send({ error: "User with this login already exists" });

        const existingEmail = await profileModel.existsByEmail(email);
        if (existingEmail)
            return reply
                .status(409)
                .send({ error: "User with this email already exists" });

        // Хешируем пароль 
        const passwordHash = await hashPassword(password);

        // Создаём нового пользователя
        const result = await profileModel.create(
            login,
            passwordHash,
            email,
            name
        );
        
        // Генерируем JWT токен для нового пользователя
        const token = request.server.jwt.sign({ id: result });
        reply.setCookie("token", token, {
            httpOnly: true,   
            path: "/",        
        });

        return reply.status(201).send({
            user: { id: result },
            token
        });

    } catch (err: any) {
        request.server.log.error({ err }, "Error during signup");
        return reply.status(500).send({ error: "Internal server error", err });
    }
};
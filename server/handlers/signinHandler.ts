import { FastifyRequest, FastifyReply } from "fastify";
import Profile from "../models/profile";
import { SigninBody } from "../shema/signin.body";
import { verifyPassword } from "../utils/hashPassword";

export const signinHandler = async (
    request: FastifyRequest<{ Body: SigninBody }>,
    reply: FastifyReply
) => {

    const profileModel = new Profile(request.server.pg);
    const { login, password } = request.body as { login: string; password: string };

    try {
        // ищем пользователя по логину
        const user = await profileModel.getHashByLogin(login);
        if (user === -1) {
            throw new Error('User not found');
        }
        // проверяем пароль
        const isPasswordValid = await verifyPassword(password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        
        // создаем JWT токен
        const token = request.server.jwt.sign({ id: user.id });
        reply.setCookie("token", token, {
            httpOnly: true,   
            path: "/",        
        });

        return reply.status(201).send({
            user: { id: user.id },
            token
        });

    } catch (err: any) {
        request.server.log.error({ err }, "Error during signin");
        return reply.status(401).send({ error: "Invalid login or password", err });
    }
};
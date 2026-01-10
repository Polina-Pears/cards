import { FastifyRequest, FastifyReply } from "fastify";
import axios from "axios";
import { YANDEX_CONFIG } from "../constants/yandex";
import { YandexUserInfo } from "../type/YandexUserInfo";
import Profile from "../models/profile";

/**
 * Обработчик callback'а после авторизации через Яндекс
 * 
 * Процесс:
 * 1. Получает код авторизации от Яндекса
 * 2. Обменивает код на access token
 * 3. Получает информацию о пользователе
 * 4. Проверяет, есть ли пользователь в БД
 * 5. Если новый пользователь - создаёт его
 * 6. Генерирует JWT токен для приложения
 * 7. Устанавливает токен в cookie
 * 8. Перенаправляет на фронтенд
 */
export const yandexCallbackHandler = async (
    request: FastifyRequest<{ Querystring: { code: string; state?: string } }>,
    reply: FastifyReply
) => {
    const { code } = request.query;

    // Проверяем наличие кода авторизации
    if (!code) {
        return reply.status(400).send({ error: "Код авторизации не предоставлен" });
    }

    // Удаляем state cookie (он был установлен при инициализации авторизации)
    reply.clearCookie("yandex_oauth_state", { path: "/" });

    try {

        // Шаг 1: Обменяем код на access token
        const params = new URLSearchParams();
        params.set("grant_type", "authorization_code");
        params.set("code", code);

        const tokenResponse = await axios.post(YANDEX_CONFIG.TOKEN_URL, params.toString(), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            auth: {
                username: YANDEX_CONFIG.CLIENT_ID,
                password: YANDEX_CONFIG.CLIENT_SECRET,
            },
        });

        
        request.server.log.info({ tokenResponse: tokenResponse.data }, "Yandex token response");
        const accessToken = tokenResponse.data.access_token;

        // Шаг 2: Получаем информацию о пользователе от Яндекса
        const userResponse = await axios.get<YandexUserInfo>(YANDEX_CONFIG.USER_INFO_URL, {
            headers: {
                Authorization: `OAuth ${accessToken}`,
            },
        });

        const yandexUser: YandexUserInfo = userResponse.data;
        const profileModel = new Profile(request.server.pg);

        let userId: number;

        // Шаг 3: Проверяем, есть ли уже такой пользователь в нашей БД
        const userExists = await profileModel.existsByYandexId(yandexUser.id);

        if (userExists) {
            // Пользователь уже существует - получаем его ID
            const user = await profileModel.getByYandexId(yandexUser.id);
            userId = user !== -1 ? user.id : -1;
        } else {
            // Шаг 4: Создаём нового пользователя в БД
            const email = yandexUser.emails[0] || `${yandexUser.login}@yandex.ru`;
            const name = yandexUser.display_name || `${yandexUser.first_name} ${yandexUser.last_name}`;

            userId = await profileModel.createYandexUser(
                yandexUser.id,
                email,
                name,
                yandexUser.login
            );
        }

        // Проверяем, успешно ли получили/создали пользователя
        if (userId === -1) {
            return reply.status(500).send({ error: "Не удалось создать или получить пользователя" });
        }

        // Шаг 5: Генерируем JWT токен для использования в приложении
        const jwtToken = request.server.jwt.sign(
            { id: userId }
        );

        // Шаг 6: Устанавливаем токен в httpOnly cookie (защита от XSS)
        reply.setCookie("token", jwtToken, {
            httpOnly: true,
            path: "/",
        });

        // Шаг 7: Перенаправляем пользователя на фронтенд 
        const redirectUrl = `${process.env.CLIENT_URL || "http://85.198.87.33:5173"}`;
        return reply.redirect(redirectUrl);

    } catch (err: any) {
        request.server.log.error({ err }, "Ошибка при OAuth callback'е Яндекса");
        return reply.status(401).send({
            error: "Ошибка OAuth авторизации",
            details: err.message
        });
    }
};



import { FastifyReply, FastifyRequest } from "fastify";
import { YANDEX_CONFIG } from "../constants/yandex";

/**
 * Инициирует процесс авторизации через Яндекс
 * 
 * Процесс:
 * 1. Генерирует случайный state для защиты от CSRF
 * 2. Сохраняет state в cookie
 * 3. Собирает URL авторизации Яндекса
 * 4. Перенаправляет пользователя на Яндекс
 * 
 * После авторизации пользователь будет отправлен обратно на yandexCallbackHandler
 */
export const yandexAuthHandler = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    // Генерируем random state для защиты от CSRF атак
    // Яндекс вернёт этот же state в callback, что подтверждает легитимность запроса
    const state = Math.random().toString(36).substring(7);
    
    // Сохраняем state в httpOnly cookie для последующей проверки
    reply.setCookie("yandex_oauth_state", state, {
        httpOnly: true,   
        sameSite: "lax",   
        path: "/",
    });
    
    // Собираем URL для перенаправления на страницу авторизации Яндекса
    const authUrl = new URL(YANDEX_CONFIG.AUTH_URL);
    authUrl.searchParams.append("client_id", YANDEX_CONFIG.CLIENT_ID);        // ID приложения
    authUrl.searchParams.append("redirect_uri", YANDEX_CONFIG.REDIRECT_URI);  // URL для возврата
    authUrl.searchParams.append("response_type", "code");                      // Запрашиваем код (не токен)
    authUrl.searchParams.append("state", state);                              // CSRF защита

    // Перенаправляем пользователя на Яндекс для авторизации
    return reply.redirect(authUrl.toString());
};
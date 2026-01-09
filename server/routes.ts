import { FastifyInstance } from "fastify";
import { API_ME, API_SIGN_OUT, API_SIGNIN, API_SIGNUP, API_YANDEX_AUTH, API_YANDEX_CALLBACK } from "./constants/api";
import { signinHandler } from "./handlers/signinHandler";
import { signupHandler } from "./handlers/signupHandler";
import signupBodySchema from "./shema/signup.body";
import signinBodySchema from "./shema/signin.body";
import { meHandler } from "./handlers/meHandler";
import { signout } from "./handlers/signoutHandler";
import { yandexAuthHandler } from "./handlers/yandexAuthHandler";
import { yandexCallbackHandler } from "./handlers/yandexCallbackHandler";

/**
 * Главная функция регистрации маршрутов приложения
 * Определяет все эндпоинты API
 */
export default async function mainRoutes(fastify: FastifyInstance) {

    /**
     * POST /api/signup
     * Регистрация нового пользователя с логином и паролем
     */
    fastify.post(API_SIGNUP,
        { schema: { body: signupBodySchema } },
        signupHandler
    );

    /**
     * POST /api/signin
     * Вход существующего пользователя с логином и паролем
     */
    fastify.post(API_SIGNIN,
        { schema: { body: signinBodySchema } },
        signinHandler
    );

    /**
     * POST /api/me
     * Получение информации о текущем пользователе
     * Требует аутентификацию (валидный JWT токен)
     */
    fastify.post(API_ME,
        { preHandler: fastify.authenticate },
        meHandler
    );

    /**
     * POST /api/signout
     * Выход из аккаунта
     * Требует аутентификацию (валидный JWT токен)
     */
    fastify.post(API_SIGN_OUT,
        { preHandler: fastify.authenticate },
        signout
    );

    /**
     * ========== Маршруты для Yandex OAuth авторизации ==========
     * Позволяют пользователям входить/регистрироваться через свой Yandex аккаунт
     */

    /**
     * GET /api/auth/yandex
     * Инициирует OAuth авторизацию через Яндекс
     * Перенаправляет пользователя на страницу авторизации Яндекса
     */
    fastify.get(API_YANDEX_AUTH, yandexAuthHandler);

    /**
     * GET /api/auth/yandex/callback
     * Callback URL, на который Яндекс перенаправляет пользователя после авторизации
     * Обменивает код на токен и создаёт/находит пользователя
     */
    fastify.get(API_YANDEX_CALLBACK, yandexCallbackHandler);
}


import type { Pool } from "pg";
import type ProfileType from "./profile.type";

/**
 * Модель для работы с таблицей профилей пользователей 
 */
class Profile {
    constructor(private readonly db: Pool) { }

    // Проверяет, существует ли пользователь с таким email
    async existsByEmail(email: ProfileType["email"]): Promise<boolean> {
        const result = await this.db.query(
            `SELECT 1 FROM public.profile a WHERE a.email = $1 LIMIT 1`,
            [email]
        );
        return result.rowCount === 1;
    }

    // Проверяет, существует ли пользователь с таким логином
    async existsByLogin(login: ProfileType["login"]): Promise<boolean> {
        const result = await this.db.query(
            `SELECT 1 FROM public.profile a WHERE a.login = $1 LIMIT 1`,
            [login]
        );
        return result.rowCount === 1;
    }

    /**
     * Создаёт нового пользователя с логином и паролем
     * @param login - логин пользователя
     * @param passwordHash - хеш пароля
     * @param email - email пользователя
     * @param name - имя пользователя
     * @returns ID созданного пользователя
     */
    async create(
        login: ProfileType["login"],
        passwordHash: ProfileType["password_hash"],
        email: ProfileType["email"],
        name: ProfileType["name"] | null
    ): Promise<number> {
        const result = await this.db.query<{ id: number }>(
            `INSERT INTO public.profile (login, email, password_hash, name)
            VALUES ($1, $2, $3, $4)
            RETURNING id`,
            [login, email, passwordHash, name]
        );

        return result.rows[0].id;
    }

    /**
     * Получает id пользователя (по логину или email) с хешем пароля 
     * @param login - логин или email
     * @returns Объект с ID и хешем пароля, или -1 если не найден
     */
    async getHashByLogin(login: ProfileType["login"]): Promise<{ id: number, password_hash: string } | -1> {
        const result = await this.db.query(
            `
                SELECT id, password_hash
                FROM public.profile
                WHERE (login = $1 or email = $1)
                LIMIT 1
            `,
            [login]
        );
        if (result.rowCount === 1) {
            return { id: result.rows[0].id, password_hash: result.rows[0].password_hash };
        } else {
            return -1;
        }
    }

    // Проверяет, существует ли пользователь с таким Yandex ID 
    async existsByYandexId(yandexId: string): Promise<boolean> {
        const result = await this.db.query(
            `SELECT 1 FROM public.profile a WHERE a.yandex_id = $1 LIMIT 1`,
            [yandexId]
        );
        return result.rowCount === 1;
    }

    /**
     * Получает пользователя по его Yandex ID
     * @param yandexId - ID пользователя в системе Яндекса
     * @returns Объект с ID пользователя, или -1 если не найден
     */
    async getByYandexId(yandexId: string): Promise<{ id: number } | -1> {
        const result = await this.db.query(
            `SELECT id FROM public.profile WHERE yandex_id = $1 LIMIT 1`,
            [yandexId]
        );
        if (result.rowCount === 1) {
            return { id: result.rows[0].id };
        } else {
            return -1;
        }
    }

    /**
     * Создаёт нового пользователя через Yandex OAuth
     * Если логин не предоставлен, генерируется на основе Yandex ID
     * @param yandexId - ID пользователя в Яндексе
     * @param email - email пользователя
     * @param name - полное имя пользователя
     * @param login - опциональный логин (если не предоставлен, генерируется)
     * @returns ID созданного пользователя
     */
    async createYandexUser(
        yandexId: string,
        email: ProfileType["email"],
        name: ProfileType["name"] | null,
        login?: string
    ): Promise<number> {
        // Генерируем уникальный логин на основе Яндекс ID если логин не предоставлен
        const finalLogin = login || `yandex_${yandexId}`;

        const result = await this.db.query<{ id: number }>(
            `INSERT INTO public.profile (login, email, yandex_id, name)
            VALUES ($1, $2, $3, $4)
            RETURNING id`,
            [finalLogin, email, yandexId, name]
        );

        return result.rows[0].id;
    }

    /**
     * Связывает существующего пользователя с его Yandex аккаунтом
     * Позволяет привязать Яндекс к уже созданному аккаунту
     * @param userId - ID пользователя в нашей системе
     * @param yandexId - ID пользователя в Яндексе
     */
    async linkYandexId(userId: number, yandexId: string): Promise<void> {
        await this.db.query(
            `UPDATE public.profile SET yandex_id = $1 WHERE id = $2`,
            [yandexId, userId]
        );
    }
}

export default Profile;
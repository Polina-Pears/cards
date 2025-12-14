import type { Pool } from "pg";
import type ProfileType from "./profile.type";

class Profile {
    constructor(private readonly db: Pool) { }

    async existsByEmail(email: ProfileType["email"]): Promise<boolean> {
        const result = await this.db.query(
            `SELECT 1
            FROM public.profile a
            WHERE a.email = $1
            LIMIT 1`,
            [email]
        );
        return result.rowCount === 1;
    }

    async existsByLogin(login: ProfileType["login"]): Promise<boolean> {
        const result = await this.db.query(
            `SELECT 1
            FROM public.profile a
            WHERE a.login = $1
            LIMIT 1`,
            [login]
        );
        return result.rowCount === 1;
    }

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
}

export default Profile;

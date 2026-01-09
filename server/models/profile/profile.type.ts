export default interface ProfileType {
    id: number;
    login: string;
    email: string;
    created_at: string;
    password_hash?: string;
    name: string;
    yandex_id?: string;
}
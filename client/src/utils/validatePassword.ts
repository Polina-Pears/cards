export type PasswordValidationResult = {
    valid: true;
} | {
    valid: false;
    error: string;
}

const COMMON_BAD_PASSWORDS = new Set<string>([
    "password",
    "qwerty",
    "123456",
    "123456789",
    "12345678",
    "111111",
    "000000",
    "qwerty123",
    "admin",
    "letmein",
    "iloveyou",
    "123123",
    "abc123",
    "password1",
    "1q2w3e4r",
    "zaq12wsx"
]);

export function validatePassword(rawPassword: string): PasswordValidationResult {
    const password = rawPassword;

    if (!password) {
        return { valid: false, error: "Введите пароль" };
    }

    // Длина: безопасный диапазон
    if (password.length < 8) {
        return { valid: false, error: "Пароль должен быть не короче 8 символов" };
    }

    if (password.length > 72) {
        return {
            valid: false,
            error: "Пароль слишком длинный (максимум 72 символа)"
        };
    }

    // Только ASCII-символы без пробелов: от ! (0x21) до ~ (0x7E)
    const asciiRegex = /^[\x21-\x7E]+$/;
    if (!asciiRegex.test(password)) {
        return {
            valid: false,
            error: "Пароль может содержать только латинские буквы, цифры и ASCII-символы без пробелов"
        };
    }

    // Наличие разных классов символов
    if (!/[a-z]/.test(password)) {
        return { valid: false, error: "Добавьте хотя бы одну строчную букву (a-z)" };
    }

    if (!/[A-Z]/.test(password)) {
        return { valid: false, error: "Добавьте хотя бы одну заглавную букву (A-Z)" };
    }

    if (!/[0-9]/.test(password)) {
        return { valid: false, error: "Добавьте хотя бы одну цифру (0-9)" };
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
        return {
            valid: false,
            error: "Добавьте хотя бы один спецсимвол (например, ! @ # $ % ^ & *)"
        };
    }

    // Три одинаковых символа подряд — запрещаем
    if (/(.)\1\1/.test(password)) {
        return {
            valid: false,
            error: "Пароль не должен содержать три одинаковых символа подряд"
        };
    }

    // Простые пароли — в бан (сравниваем в нижнем регистре)
    const lower = password.toLowerCase();
    if (COMMON_BAD_PASSWORDS.has(lower)) {
        return { valid: false, error: "Слишком простой пароль, придумайте сложнее" };
    }

    return { valid: true };
}

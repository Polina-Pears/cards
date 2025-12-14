const DISPOSABLE_DOMAINS = new Set<string>([
    "mailinator.com",
    "10minutemail.com",
    "guerrillamail.com",
    "tempmail.com",
    "getnada.com",
    "yopmail.com"
    // при желании можешь дополнять
]);

const COMMON_TLDS = new Set<string>([
    "com", "net", "org", "io", "dev", "app",
    "ru", "su", "by", "kz", "ua",
    "info", "biz", "online", "store", "site",
    "me", "club", "xyz"
    // сюда тоже можно добавлять нужные тебе зоны
]);

export type EmailValidationResult = {
    valid: true;
} | {
    valid: false;
    error: string;
}

export default function validateEmail(rawEmail: string): EmailValidationResult {
    const email = rawEmail.trim();

    if (!email) {
        return { valid: false, error: "Введите email" };
    }

    // Общие длины по RFC (примерно)
    if (email.length > 254) {
        return { valid: false, error: "Слишком длинный email" };
    }

    // Разбиваем на local-part и домен
    const parts = email.split("@");
    if (parts.length !== 2) {
        return { valid: false, error: "Email должен содержать один символ @" };
    }

    const [localPart, domain] = parts;

    if (!localPart || !domain) {
        return { valid: false, error: "Неверный формат email" };
    }

    // --- 1. Проверка local-part  ---

    // Только латиница, цифры, точка, подчёркивание, дефис
    const localRegex = /^[A-Za-z0-9._-]+$/;
    if (!localRegex.test(localPart)) {
        return {
            valid: false,
            error:"В логине email допустимы только латинские буквы, цифры и символы . _ -"
        };
    }

    if (localPart.length > 64) {
        return {
            valid: false,
            error: "Слишком длинная часть email до @ (максимум 64 символа)"
        };
    }

    if (localPart.startsWith(".") || localPart.endsWith(".")) {
        return {
            valid: false,
            error: "Часть email до @ не должна начинаться или заканчиваться точкой"
        };
    }

    if (localPart.startsWith("-") || localPart.endsWith("-")) {
        return {
            valid: false,
            error:
                "Часть email до @ не должна начинаться или заканчиваться дефисом"
        };
    }

    if (localPart.includes("..")) {
        return {
            valid: false,
            error: "В email не должно быть двух точек подряд"
        };
    }

    // --- 2. Проверка домена ---
    const domainLower = domain.toLowerCase();

    if (domainLower.length > 253) {
        return {
            valid: false,
            error: "Слишком длинный домен в email"
        };
    }

    if (domainLower.includes("..")) {
        return {
            valid: false,
            error: "В домене email не должно быть двух точек подряд"
        };
    }

    const domainLabels = domainLower.split(".");

    if (domainLabels.length < 2) {
        return {
            valid: false,
            error: "Доменная часть email должна содержать хотя бы одну точку"
        };
    }

    // Последняя часть — TLD
    const tld = domainLabels[domainLabels.length - 1];

    // Проверяем каждую часть домена (label)
    const domainLabelRegex = /^[a-z0-9-]+$/;

    for (const label of domainLabels) {
        if (!label) {
            return {
                valid: false,
                error: "Неверный домен в email"
            };
        }

        if (!domainLabelRegex.test(label)) {
            return {
                valid: false,
                error: "В домене email допустимы только латинские буквы, цифры и дефис"
            };
        }

        if (label.startsWith("-") || label.endsWith("-")) {
            return {
                valid: false,
                error: "Части домена не должны начинаться или заканчиваться дефисом"
            };
        }

        if (label.length > 63) {
            return {
                valid: false,
                error: "Слишком длинная часть домена в email"
            };
        }
    }

    // --- 3. Проверка TLD (зоны) ---

    const tldRegex = /^[a-z]{2,24}$/;
    if (!tldRegex.test(tld)) {
        return {
            valid: false,
            error: "Неверная доменная зона в email"
        };
    }

    // Опционально: жёсткая проверка по списку популярных TLD
    if (!COMMON_TLDS.has(tld)) {
        return {
            valid: false,
            error: "Неподдерживаемая доменная зона email"
        };
    }

    // --- 4. Блокировка временной почты / disposable email ---
    if (DISPOSABLE_DOMAINS.has(domainLower)) {
        return {
            valid: false,
            error: "Временные email-адреса не поддерживаются"
        };
    }

    // Можно блокировать поддомены disposable-сервисов
    for (const disposable of DISPOSABLE_DOMAINS) {
        if (domainLower === disposable || domainLower.endsWith(`.${disposable}`)) {
            return {
                valid: false,
                error: "Временные email-адреса не поддерживаются"
            };
        }
    }

    return { valid: true };
}

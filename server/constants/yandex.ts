/**
 * Конфигурация для OAuth авторизации через Яндекс
 * Содержит необходимые параметры для взаимодействия с Yandex OAuth сервисом
*/
export const YANDEX_CONFIG = {
    CLIENT_ID: process.env.YANDEX_CLIENT_ID || '',// ID приложения, полученный при регистрации на developer.yandex.ru
    CLIENT_SECRET: process.env.YANDEX_CLIENT_SECRET || '',// Секретный ключ приложения 
    REDIRECT_URI: process.env.YANDEX_REDIRECT_URI || 'http://93.189.231.213:3000/api/auth/yandex/callback', // URL перенаправления после авторизации
    AUTH_URL: 'https://oauth.yandex.ru/authorize', // URL для начала OAuth процесса авторизации
    TOKEN_URL: 'https://oauth.yandex.ru/token', // URL для обмена кода авторизации на access token
    USER_INFO_URL: 'https://login.yandex.ru/info' // URL для получения информации о пользователе
}; 
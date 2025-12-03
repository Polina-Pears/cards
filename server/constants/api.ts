// API Route Constants
export const API_PREFIX = "/api";
export const API_SIGNUP = "/api/signup";
export const API_SIGNIN = "/api/signin";

// Static Files Constants
export const STATIC_PREFIX = "/";
export const STATIC_ROOT = "client";
export const INDEX_FILE = "index.html";

// HTTP Methods
export const HTTP_METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE"
};

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    CONFLICT: 409,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

// Error Messages
export const ERROR_MESSAGES = {
    MISSING_CREDENTIALS: "Email and password are required",
    USER_EXISTS: "User already exists",
    INVALID_CREDENTIALS: "Invalid credentials",
    NOT_FOUND: "Not Found",
    INTERNAL_ERROR: "Internal Server Error"
};

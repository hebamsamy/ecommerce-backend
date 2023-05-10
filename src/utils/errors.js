import respondWith from "./response.js";

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const handleError = (err, res) => {
  const { message, statusCode = 500 } = err;
  respondWith(statusCode, {}, message, false, res);
};

const errors = {
  TOKEN_NOT_AUTHENTICATED: "You're not authenticated, Token's error.", // THIS WILL BE USED ONLY IN IS-AUTH MIDDLEWARE.
  NOT_AUTHENTICATED: "You're not authenticated.",
  NOT_AUTHORIZED: "You're not authorized to do that.",
  INVALID_TOKEN: "Token is invalid.",
  ALREADY_EXIST: "User already exists",
  NOT_VERIFIED: "Your account has not been verified yet, please check your email",
  NOT_FOUND: "Resource not found",
  ALREADY_VERIFIED: "User is already verified.",
  EXPIRED_CODE: "Code has expired.",
  CHECK_ALREADY_EXIST: "You have that URL already in check",
};

export { CustomError, handleError, errors };

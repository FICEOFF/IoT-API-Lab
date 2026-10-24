import { bearerAuth } from "hono/bearer-auth";

const secret = process.env.SECRET_PASSWORD;

if (!secret) {
    throw new Error("SECRET_PASSWORD is not set in .env");
}

export const auth = bearerAuth({ token: secret });

import type { MiddlewareHandler } from 'hono'

export const authMiddleware: MiddlewareHandler = async (c, next) => {
    const apiToken = process.env.SECRET_PASSWORD
    if (!apiToken) {
        return c.json({ error: 'API authentication is not configured' }, 500)
    }
    const authorization = c.req.header('Authorization')
    if (authorization !== `Bearer ${apiToken}`) {
        return c.json({ error: 'Unauthorized' }, 401)
    }
    await next()
}

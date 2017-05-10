import { RequestHandler, Router } from 'express'
import Http = require('http')

/** 
 * 
 * @export
 * @class HttpError 
 */
export class HttpError extends Error {
    constructor(public readonly status: number, message?: string) {
        super(message || Http.STATUS_CODES[status])
        this.name = Http.STATUS_CODES[status]
    }
}

/**
 * Wrap a request handler that might return promise, to handle promise error 
 * 
 * @export
 * @param handler the handler to be wrapped
 * @returns wrapped request handler 
 */
export function try$(handler: RequestHandler): RequestHandler {
    return async (req, res, next) => {
        try {
            await handler(req, res, next)
        } catch (e) {
            next(e)
        }
    }
}

/**
 * Hang a router until some tasks done
 * 
 * @export
 * @param router 
 * @returns 
 */
export function hang(router: Router) {
    let initDone = false;
    router.use((req, res, next) => {
        if (initDone)
            return next();

        // response service unavailable
        next(new HttpError(503, 'Under initalizing'))
    })

    return {
        until(task: Function) {
            (async () => {
                try {
                    await task()
                    initDone = true
                } catch (e) {
                    console.error("Failed to initialize:", e);
                    process.exit(1);
                }
            })()
        }
    }
}

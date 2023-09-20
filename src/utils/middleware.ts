import { ParameterizedContext } from 'koa';
import { HttpError, HttpStatusCode } from './httperror';
import { logger } from './logger'

export const httpErrorMiddleware = async (ctx: ParameterizedContext<any, {}>, next: () => Promise<any>) => {
	try {
		await next()
	} catch (err) {
		if (err instanceof HttpError) {
			ctx.status = err.statusCode
		} else {
			ctx.status = HttpStatusCode.InternalError
			logger.info("unexpected error: ", err)
		}
		ctx.body = {
			code: err.statusCode,
			message: err.message || err.toString()
		}
	}
}
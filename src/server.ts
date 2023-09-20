const Koa = require('koa')
const bodyParser = require("koa-bodyparser")
const cors = require('koa-cors')
const convert = require('koa-convert');
const { bearerToken } = require('koa-bearer-token')

import { logger } from './utils/logger'
import { httpErrorMiddleware } from './utils/middleware'
import { sequelize } from './models'
import router from './controllers/router'

async function start() {
	await sequelize.sync()
	const app = new Koa();
	app
		.use(convert(bodyParser()))
		.use(bearerToken({
			headerKey: 'Bearer',
			reqKey: 'token',
		}))
		.use(convert(cors({
			origin: "*"
		})))
		.use(httpErrorMiddleware)
		.use(router.routes())
		.use(router.allowedMethods());

	const port = process.env.PORT || 3000

	console.log("Server running on port " + port)
	logger.info("Server running on port " + port)
	app.listen(port);
}

start();

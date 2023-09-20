import * as Router from 'koa-router';
import service from './service'

const router = new Router();

router.get("/voucher/status", async (ctx: any) => {
	const token = ctx.request.token
	const address = await service.getAddress(token)
	const voucher = await service.checkClaimed(address)
	ctx.body = {
		amount: voucher.amount,
		expiredAt: voucher.expiredAt,
		code: voucher.code
	}
});

router.post("/voucher/claim", async (ctx: any) => {
	const token = ctx.request.token
	const address = await service.getAddress(token)
	const voucher = await service.checkClaimed(address)
	await service.claim(voucher.code)
	ctx.body = { code: voucher.code }
});

export default router;
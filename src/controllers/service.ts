import axios from "axios";
import { Vouchers } from "../models";
import { HttpError, HttpStatusCode } from "../utils/httperror";

interface UserRes {
	code: number,
	message: string
	data: {
		wallet: {
			address?: string
			walletType: string
		}
	}
}

export default class Service {

	static async checkOauth(token: string) {
		try {
			const uri = process.env.OAUTHURL ?? 'https://auth.foreverland.xyz/user'
			return await axios.get<UserRes>(uri, {
				headers: {
					'authorization': `Bearer ${token}`
				}
			})
		} catch (e) {
			throw new HttpError(HttpStatusCode.InternalError, "auth failed")
		}
	}

	static async getAddress(token: string) {
		try {
			const res = await this.checkOauth(token)
			const address = res.data.data.wallet.address
			if (!address) {
				throw new HttpError(HttpStatusCode.Forbidden, 'user not found')
			}
			return address
		} catch (e) {
			if (e instanceof HttpError) {
				throw e
			}
			throw new HttpError(HttpStatusCode.BadRequest, 'Bad request')
		}
	}

	static async getVoucher(code: string) {
		const vourcher = await Vouchers.findOne({
			where: {
				code
			}
		})
		if (!vourcher) {
			throw new HttpError(HttpStatusCode.NotFound, 'voucher not found')
		}
		return vourcher.dataValues
	}

	static async getVoucherBy(address: string) {
		const vourcher = await Vouchers.findOne({
			where: {
				address
			}
		})
		if (!vourcher) {
			throw new HttpError(HttpStatusCode.NotFound, 'voucher not found')
		}
		return vourcher.dataValues
	}

	static async checkClaimed(address: string) {
		const voucher = await this.getVoucherBy(address)
		if (voucher.isClaimed) {
			throw new HttpError(HttpStatusCode.Forbidden, 'voucher is claimed')
		}
		return voucher;
	}

	static async claim(code: string) {
		const n = await Vouchers.update(
			{
				isClaimed: true
			},
			{ where: { code } }
		)
		return n[0] == 0;
	}

}
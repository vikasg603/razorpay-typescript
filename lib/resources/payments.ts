'use strict'

/*
 * DOCS: https://razorpay.com/docs/subscriptions/api/
 */

import API from '../api'
import { AcquirerData, Notes, SupportedCurrency } from '../types'
import { normalizeBoolean, normalizeDate, normalizeNotes } from '../utils/razorpay-utils'
import RazorpayError from '../utils/RazorPayError'

const ID_REQUIRED_MSG = '`payment_id` is mandatory'

export interface paymentAllParams {
	from?: string | number | Date;
	to?: string | number | Date;
	count?: number;
	skip?: number;
}

export interface paymentFetchParams {
	expand?: ('card' | 'emi' | 'offers')[]
}

export interface PaymentEntity {
	id: string
	entity: string
	amount: number
	currency: string
	status: string
	order_id: string
	invoice_id: any
	international: boolean
	method: string
	amount_refunded: number
	refund_status: any
	captured: boolean
	description: string
	card_id: any
	bank: any
	wallet: any
	vpa: string
	email: string
	contact: string
	notes: any[]
	fee: number
	tax: number
	error_code: any
	error_description: any
	error_source: any
	error_step: any
	error_reason: any
	acquirer_data: AcquirerData
	created_at: number
}

export interface RefundEntity {
	id: string
	entity: string
	amount: number
	currency: string
	payment_id: string
	notes: { [key: string]: string }
	receipt: any
	acquirer_data: AcquirerData
	created_at: number
	batch_id: any
	status: string
	speed_processed: string
	speed_requested: string
}

export interface paymentAllResponse {
	entity: 'collection',
	count: number,
	items: PaymentEntity[]
}

export interface paymentRefundParams {
	amount?: string | number;
	speed?: 'normal' | string
	notes?: Notes;
	receipt?: string;
}

export interface paymentTransferParams {
	transfers?: paymentTransferEntity[]
}

export interface TransferEntity {
	entity: 'collection'
	count: number
	items: paymentTransferEntity[]
}

export interface paymentTransferEntity {
	id: string
	entity: string
	source: string
	recipient: string
	amount: number
	currency: string
	amount_reversed: number
	notes: Notes
	fees: number
	tax: number
	on_hold: boolean
	on_hold_until?: number
	recipient_settlement_id: any
	created_at: number
	linked_account_notes: string[]
	processed_at: number
}

export default function payments (api: API) {
	return {
		async all (params: paymentAllParams = {}) {
			let { from, to, count, skip } = params

			if (from) {
				from = normalizeDate(from)
			}

			if (to) {
				to = normalizeDate(to)
			}

			count = Number(count) || 10
			skip = Number(skip) || 0

			return api.get<paymentAllParams>({
				url: '/payments',
				data: {
					from,
					to,
					count,
					skip
				}
			})
		},

		async fetch (paymentId: string) {
			if (!paymentId) {
				throw new RazorpayError('Missing Parameter', ID_REQUIRED_MSG)
			}

			return api.get<PaymentEntity>({ url: `/payments/${paymentId}` })
		},

		async capture (paymentId: string, amount: number | string, currency?: SupportedCurrency) {
			if (!amount) {
				throw new Error('`amount` is mandatory')
			}

			const payload: { amount: number, currency?: SupportedCurrency } = {
				amount: Number(amount)
			}

			if (typeof currency === 'string') {
				payload.currency = currency
			}

			// Checking this here because of the above if condition.

			if (!paymentId) {
				throw new RazorpayError('Missing Parameter', ID_REQUIRED_MSG)
			}

			return api.post<PaymentEntity>({
				url: `/payments/${paymentId}/capture`,
				data: payload
			})
		},

		async refund (paymentId: string, params: paymentRefundParams = {}) {
			const { notes, ...otherParams } = params

			if (!paymentId) {
				throw new RazorpayError('Missing Parameter', ID_REQUIRED_MSG)
			}

			const data = Object.assign(otherParams, normalizeNotes(notes))
			return api.post<RefundEntity>({
				url: `/payments/${paymentId}/refund`,
				data
			})
		},

		async transfer (paymentId: string, params: paymentTransferParams = {}) {
			if (!paymentId) {
				throw new RazorpayError('Missing Parameter', ID_REQUIRED_MSG)
			}

			if (params.transfers) {
				const transfers = params.transfers
				transfers.forEach(function (transfer) {
					transfer.on_hold = normalizeBoolean(!!transfer.on_hold)
					transfer.notes = normalizeNotes(transfer.notes)
				})
			}
			return api.post<TransferEntity>({
				url: `/payments/${paymentId}/transfers`,
				data: params
			})
		}

		/*
			bankTransfer(paymentId: string, callback?: callbackFn) {

			if (!paymentId) {

				if(callback) {
				callback(new Error(ID_REQUIRED_MSG), null)
				}
				return Promise.reject(new Error(ID_REQUIRED_MSG))
			}

			return api.get({
				url: `/payments/${paymentId}/bank_transfer`
			}, callback);
			}
		*/
	}
}

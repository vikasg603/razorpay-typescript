'use strict'

import API from '../api'
import { Notes, SupportedCurrency } from '../types'
import { normalizeDate } from '../utils/razorpay-utils'
import RazorpayError from '../utils/RazorPayError'

export interface TransferListParams {
	from?: string | number | Date;
	to?: string | number | Date;
	count?: number;
	skip?: number;
	payment_id?: string;
	recipient_settlement_id?: string;
}

export interface TransferEntity {
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
	on_hold_until: any
	recipient_settlement_id: any
	created_at: number
	linked_account_notes: any[]
	processed_at: number
}

export interface TransferListResponse {
	entity: 'collection';
	count: number;
	items: TransferEntity[];
}

export interface TransferCreateParams {
	account: string;
	amount: number;
	currency: SupportedCurrency;
	notes?: Notes;
}

export interface reversalEntity {
	id: string;
	entity: 'reversal';
	transfer_id: string;
	amount: number;
	currency: SupportedCurrency;
	created_at: number;
}

export default function (api: API) {
	return {
		async all (params : TransferListParams = {}) {
			let { from, to, count, skip, payment_id, recipient_settlement_id } = params
			let url = '/transfers'

			if (payment_id) {
				url = `/payments/${payment_id}/transfers`
			}

			if (from) {
				from = normalizeDate(from)
			}

			if (to) {
				to = normalizeDate(to)
			}

			count = Number(count) || 10
			skip = Number(skip) || 0

			return api.get<TransferListResponse>({
				url,
				data: {
					from,
					to,
					count,
					skip,
					recipient_settlement_id
				}
			})
		},

		async fetch (transferId: string) {
			if (!transferId) {
				throw new RazorpayError('Missing Paramter', '`transfer_id` is mandatory')
			}

			const url = `/transfers/${transferId}`

			return api.get<TransferEntity>({ url })
		},

		async create (params: TransferCreateParams) {
			return api.post<TransferEntity>({
				url: '/transfers',
				data: params
			})
		},

		/*
		async edit (transferId: string, params: Partial<TransferCreateParams>) {
			return api.patch<TransferEntity>({
				url: `/transfers/${transferId}`,
				data: params
			})
		},
		*/

		async reverse (transferId: string, params: {amount: string | number}) {
			if (!transferId) {
				throw new RazorpayError('Missing Paramter', '`transfer_id` is mandatory')
			}

			const data = params
			const url = `/transfers/${transferId}/reversals`

			return api.post<reversalEntity>({
				url,
				data
			})
		}
	}
}

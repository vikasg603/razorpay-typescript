'use strict'

/*
 * DOCS: https://razorpay.com/docs/subscriptions/api/
 */

import API from '../api'
import { AcquirerData, Notes } from '../types'
import { normalizeDate } from '../utils/razorpay-utils'

export interface RefundEntity {
	id: string
	entity: string
	amount: number
	currency: string
	payment_id: string
	notes: Notes
	receipt: any
	acquirer_data: AcquirerData
	created_at: number
	batch_id: any
	status: string
	speed_processed: string
	speed_requested: string
}

export interface RefundsResponse {
	items: RefundEntity[]
	count: number
	entity: 'collection'
}

export interface RefundsAllParams {
	from?: string | number | Date
	to?: string | number | Date
	count?: number
	skip?: number
	payment_id?: string
}

export default function refunds (api: API) {
	return {
		async all (params: RefundsAllParams = {}) {
			let { from, to, count, skip, payment_id } = params
			let url = '/refunds'

			if (payment_id) {
				url = `/payments/${payment_id}/refunds`
			}

			if (from) {
				from = normalizeDate(from)
			}

			if (to) {
				to = normalizeDate(to)
			}

			count = Number(count) || 10
			skip = Number(skip) || 0

			return await api.get({
				url,
				data: {
					from,
					to,
					count,
					skip
				}
			})
		},

		async fetch (refundId: string, params: { payment_id?: string } = {}) {
			const { payment_id } = params
			if (!refundId) {
				throw new Error('`refund_id` is mandatory')
			}

			let url = `/refunds/${refundId}`

			if (payment_id) {
				url = `/payments/${payment_id}${url}`
			}

			return await api.get({ url })
		}
	}
}

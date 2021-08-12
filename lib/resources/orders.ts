'use strict'

import API from '../api'
import { Notes, SupportedCurrency } from '../types'
import { normalizeBoolean, normalizeDate } from '../utils/razorpay-utils'
import RazorpayError from '../utils/RazorPayError'
import { paymentAllResponse } from './payments'

export interface OrderAllParams {
  from?: string | number | Date;
  to?: string | number | Date;
  count?: number;
  skip?: number;
  authorized?: boolean;
  receipt?: string
}

export interface OrderEntity {
  id: string
  entity: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  status: string
  attempts: number
  notes: Notes[]
  created_at: number
}

export interface OrderCreateParams {
	amount: number;
	currency: SupportedCurrency;
	receipt?: string;
	partial_payment?: boolean;
	notes?: Notes;
  }

export interface OrderAllResponse {
  items: OrderEntity[];
  count: number;
  entity: 'collection';
}

export default function orders (api: API) {
	return {
		async all (params: OrderAllParams = {}) {
			let { from, to, count, skip, authorized, receipt } = params

			if (from) {
				from = normalizeDate(from)
			}

			if (to) {
				to = normalizeDate(to)
			}

			count = Number(count) || 10
			skip = Number(skip) || 0
			authorized = normalizeBoolean(authorized)

			return api.get<OrderAllResponse>({
				url: '/orders',
				data: {
					from,
					to,
					count,
					skip,
					authorized,
					receipt
				}
			})
		},

		async fetch (orderId: string) {
			if (!orderId) {
				throw new RazorpayError('Missing parameter', '`order_id` is mandatory')
			}

			return api.get<OrderEntity>({
				url: `/orders/${orderId}`
			})
		},

		async create (params: OrderCreateParams) {
			const { amount } = params

			if (!amount) {
				throw new RazorpayError('Missing Paramter', '`amount` is mandatory')
			}

			params.currency = params.currency || 'INR'

			return api.post<OrderEntity>({
				url: '/orders',
				data: params
			})
		},

		async fetchPayments (orderId: string) {
			if (!orderId) {
				throw new RazorpayError('Missing Paramter', '`order_id` is mandatory')
			}

			return api.get<paymentAllResponse>({ url: `/orders/${orderId}/payments` })
		}
	}
}

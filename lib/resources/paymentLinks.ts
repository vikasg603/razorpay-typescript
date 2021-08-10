'use strict'

/*
 * DOCS: https://razorpay.com/docs/subscriptions/api/
 */

import API from '../api'
import { Notes, SupportedCurrency } from '../types'
import RazorpayError from '../utils/RazorPayError'

const ID_REQUIRED_MSG = '`amount` is mandatory'

export interface PaymentLinkEntity {
	accept_partial: boolean
	amount: number
	amount_paid: number
	callback_method: string
	callback_url: string
	cancelled_at: number
	created_at: number
	currency: string
	customer: Customer
	description: string
	expire_by: number
	expired_at: number
	first_min_partial_amount: number
	id: string
	notes: { [key: string]: string }
	notify: Notify
	payments: any[]
	reference_id: string
	reminder_enable: boolean
	reminders: Reminders
	short_url: string
	source: string
	source_id: string
	status: string
	updated_at: number
	user_id: string
}

export interface Customer {
	contact: string
	email: string
	name: string
}

export interface Notify {
	email: boolean
	sms: boolean
}

export interface Reminders {
	status: string
}

interface paymentLinkParams {
	amount: number;
	currency?: SupportedCurrency;
	accept_partial?: boolean;
	first_min_partial_amount?: number;
	upi_link?: boolean;
	description?: string;
	reference_id?: string;
	customer?: Customer;
	expire_by?: number;
	notify?: Notify;
	notes?: Notes;
	callback_url?: string;
	callback_method?: string;
	reminder_enable?: string;
}

interface paymentLinkAllParams {
	payment_id?: string;
	reference_id?: string;
}

interface paymentLinkAllResponse {
	payment_links: PaymentLinkEntity[];
}

export default function paymentLinks (api: API) {
	return {
		async create (params: paymentLinkParams) {
			const { amount } = params

			if (!amount) {
				throw new RazorpayError('Missing Parameter', ID_REQUIRED_MSG)
			}

			return api.post<PaymentLinkEntity>({
				url: '/payment-links',
				data: params
			})
		},

		async all (params: paymentLinkAllParams) {
			const { payment_id, reference_id } = params

			let data = {}

			if (payment_id) {
				data = { payment_id }
			}
			if (reference_id) {
				data = { reference_id }
			}

			return api.get<paymentLinkAllResponse>({
				url: '/payment-links',
				data: data
			})
		},

		async fetch (payment_id: string) {
			if (!payment_id) {
				throw new RazorpayError('Missing Parameter', '`payment_id` is missing')
			}
			return api.get<PaymentLinkEntity>({ url: `/payment-links/${payment_id}` })
		}
	}
}

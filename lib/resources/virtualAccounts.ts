'use strict'

import API from '../api'
import { Notes } from '../types'
import { normalizeDate, normalizeNotes } from '../utils/razorpay-utils'
import RazorpayError from '../utils/RazorPayError'
import { paymentAllResponse } from './payments'

const BASE_URL = '/virtual_accounts'
const ID_REQUIRED_MSG = '`virtual_account_id` is mandatory'

export interface VirtualAccountListParams {
	from?: string | Date | number;
	to?: string | Date | number;
	count?: number;
	skip?: number;
}

export interface virtualAccountEntity {
	id: string
	name: string
	entity: string
	status: string
	description: string
	amount_expected: number
	notes: Notes
	amount_paid: number
	customer_id: string
	receivers: Receiver[]
	allowed_payers: AllowedPayer[]
	close_by: number
	closed_at: number
	created_at: number
}

export interface Receiver {
	id: string
	entity: string
	ifsc: string
	bank_name: string
	name: string
	notes: Notes
	account_number: string
}

export interface AllowedPayer {
	type: string
	bank_account: BankAccount
}

export interface BankAccount {
	ifsc: string
	account_number: string
}

export interface VirtualAccountListResponse {
	entity: 'collection';
	count: number;
	items: virtualAccountEntity[]
}

export interface VirtualAccountCreateParams {
	receivers: { types: 'bank_account'[] }
	allowed_payers: AllowedPayer[];
	description?: string;
	customer_id?: string;
	notes?: Notes;
	close_by?: number;
}

export default function (api: API) {
	return {
		async all (params: VirtualAccountListParams = {}) {
			let { from, to, count, skip, ...otherParams } = params
			const url = BASE_URL

			if (from) {
				from = normalizeDate(from)
			}

			if (to) {
				to = normalizeDate(to)
			}

			count = Number(count) || 10
			skip = Number(skip) || 0

			return api.get<VirtualAccountListResponse>({
				url,
				data: {
					from,
					to,
					count,
					skip,
					...otherParams
				}
			})
		},

		async fetch (virtualAccountId: string) {
			if (!virtualAccountId) {
				throw new RazorpayError('Missing Parameter', ID_REQUIRED_MSG)
			}

			const url = `${BASE_URL}/${virtualAccountId}`

			return api.get({ url })
		},

		async create (params : VirtualAccountCreateParams) {
			const { notes, ...rest } = params
			const data = Object.assign(rest, normalizeNotes(notes))

			return api.post({
				url: BASE_URL,
				data
			})
		},

		async close (virtualAccountId: string) {
			if (!virtualAccountId) {
				throw new RazorpayError('Missing Parameter', ID_REQUIRED_MSG)
			}

			return api.post({
				url: `${BASE_URL}/${virtualAccountId}/close`
			})
		},

		async fetchPayments (virtualAccountId: string) {
			if (!virtualAccountId) {
				throw new RazorpayError('Missing Parameter', ID_REQUIRED_MSG)
			}

			const url = `${BASE_URL}/${virtualAccountId}/payments`

			return api.get<paymentAllResponse>({
				url
			})
		}
	}
}

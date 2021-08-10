'use strict'

import API from '../api'
import { Notes, SupportedCurrency } from '../types'
import { normalizeDate } from '../utils/razorpay-utils'
import RazorpayError from '../utils/RazorPayError'

/*
 * DOCS: https://razorpay.com/docs/subscriptions/api/
 */

interface planItem {
	name: string;
	amount: number;
	currency: SupportedCurrency;
	description?: string;
}

interface planCreateParams {
	period: 'daily' | 'weekly' | 'monthly' | 'yearly';
	interval: number;
	item: planItem;
	notes?: Notes;
}

export interface planEntity {
	id: string
	entity: string
	interval: number
	period: string
	item: Item
	notes: Notes
	created_at: number
}

export interface Item {
	id: string
	active: boolean
	name: string
	description: string
	amount: number
	unit_amount: number
	currency: string
	type: string
	unit: any
	tax_inclusive: boolean
	hsn_code: any
	sac_code: any
	tax_rate: any
	tax_id: any
	tax_group_id: any
	created_at: number
	updated_at: number
}

export interface planAllParams {
	from?: string | number | Date;
	to?: string | number | Date;
	count?: number;
	skip?: number;
}

export default function plansApi (api: API) {
	const BASE_URL = '/plans'
	const MISSING_ID_ERROR = 'Plan ID is mandatory'

	return {

		async create (params: planCreateParams) {
			/*
			* Creates a plan
			*
			* @param {Object} params
			*
			* @return {Promise}
			*/

			const url = BASE_URL

			return api.post<planEntity>({
				url,
				data: params
			})
		},

		async fetch (planId: string) {
			/*
			* Fetches a plan given Plan ID
			*
			* @param {String} planId
			*
			* @return {Promise}
			*/

			if (!planId) {
				throw new RazorpayError('Missing Parameter', MISSING_ID_ERROR)
			}

			const url = `${BASE_URL}/${planId}`

			return api.get({ url })
		},

		async all (params: planAllParams = {}) {
			/*
			* Get all Plans
			*
			* @param {Object} params
			*
			* @return {Promise}
			*/

			let { from, to, count, skip } = params
			const url = BASE_URL

			if (from) {
				from = normalizeDate(from)
			}

			if (to) {
				to = normalizeDate(to)
			}

			count = Number(count) || 10
			skip = Number(skip) || 0

			return api.get({
				url,
				data: {
					...params,
					from,
					to,
					count,
					skip
				}
			})
		}
	}
}

'use strict'

/*
 * DOCS: https://razorpay.com/docs/subscriptions/api/
 */

import API from '../api'
import { Notes, SupportedCurrency } from '../types'
import { normalizeDate, normalizeNotes } from '../utils/razorpay-utils'
import RazorpayError from '../utils/RazorPayError'

export interface AddonItem {
	name?: string;
	amount?: number;
	currency?: SupportedCurrency;
}

export interface SubscriptionAddon {
	item: AddonItem
}

export interface SubscriptionCreateParams {
	plan_id: string;
	total_count: number;
	quantity?: number;
	start_date?: string;
	expire_by?: string;
	customer_notify?: 0 | 1;
	addons: SubscriptionAddon[];
	offer_id?: string;
	notes?: Notes;
}

export interface SubscriptionEntity {
	id: string
	entity: string
	plan_id: string
	status: string
	current_start: any
	current_end: any
	ended_at: any
	quantity: number
	notes: Notes
	charge_at: number
	start_at: number
	end_at: number
	auth_attempts: number
	total_count: number
	paid_count: number
	customer_notify: boolean
	created_at: number
	expire_by: number
	short_url: string
	has_scheduled_changes: boolean
	change_scheduled_at: any
	source: string
	offer_id: string
	remaining_count: number
}

export interface SubscriptionListParams {
	plan_id?: string;
	from?: string | number | Date;
	to?: string | number | Date;
	count?: number;
	skip?: number;
}

export interface SubscriptionListResponse {
	entity: 'collection';
	count: number;
	items: SubscriptionEntity[];
}

export interface AddonCreateItem {
	name: string;
	amount: number;
	currency: SupportedCurrency;
	description?: string;
}

export interface SubscriptionCreateAddon {
	item: AddonCreateItem
}

export interface AddonCreateResponse {
	id: string
	entity: string
	item: AddonItem
	quantity: number
	created_at: number
	subscription_id: string
	invoice_id: any
}

export default function subscriptionsApi (api: API) {
	const BASE_URL = '/subscriptions'
	const MISSING_ID_ERROR = 'Subscription ID is mandatory'

	return {

		async create (params: SubscriptionCreateParams) {
			/*
			 * Creates a Subscription
			 *
			 * @param {Object} params
			 *
			 * @return {Promise}
			 */

			const url = BASE_URL
			const { notes, ...rest } = params
			const data = Object.assign(rest, normalizeNotes(notes))

			return api.post<SubscriptionEntity>({
				url,
				data
			})
		},

		async fetch (subscriptionId: string) {
			/*
			 * Fetch a Subscription given Subscription ID
			 *
			 * @param {String} subscriptionId
			 *
			 * @return {Promise}
			 */

			if (!subscriptionId) {
				throw new RazorpayError('Missing Parameter', MISSING_ID_ERROR)
			}

			const url = `${BASE_URL}/${subscriptionId}`

			return api.get<SubscriptionEntity>({ url })
		},

		async all (params: SubscriptionListParams = {}) {
			/*
			 * Get all Subscriptions
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

			return api.get<SubscriptionListResponse>({
				url,
				data: {
					...params,
					from,
					to,
					count,
					skip
				}
			})
		},

		async cancel (subscriptionId: string, cancelAtCycleEnd : boolean = false) {
			/*
			 * Cancel a subscription given id and optional cancelAtCycleEnd
			 *
			 * @param {String} subscription
			 * @param {Boolean} cancelAtCycleEnd
			 *
			 * @return {Promise}
			 */

			const url = `${BASE_URL}/${subscriptionId}/cancel`

			if (!subscriptionId) {
				throw new RazorpayError('Missing Parameter', MISSING_ID_ERROR)
			}

			if (typeof cancelAtCycleEnd !== 'boolean') {
				throw new RazorpayError('Missing Parameter', 'The second parameter, Cancel at the end of cycle should be a Boolean')
			}

			return api.post<SubscriptionEntity>({
				url,
				...(cancelAtCycleEnd && { data: { cancel_at_cycle_end: 1 } })
			})
		},

		async createAddon (subscriptionId: string, params: SubscriptionCreateAddon) {
			/*
			 * Creates addOn for a given subscription
			 *
			 * @param {String} subscriptionId
			 *
			 * @return {Promise}
			 */

			const url = `${BASE_URL}/${subscriptionId}/addons`

			if (!subscriptionId) {
				throw new RazorpayError('Missing Parameter', MISSING_ID_ERROR)
			}

			return api.post<AddonCreateResponse>({
				url,
				data: params
			})
		}
	}
}

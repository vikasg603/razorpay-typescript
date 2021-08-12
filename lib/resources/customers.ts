'use strict'

import API from '../api'
import { Notes } from '../types'
import RazorpayError from '../utils/RazorPayError'

interface CustomerEntity {
	id: string;
	name: string;
	email: string;
	contact: string;
	gstin: string;
	notes: Notes;
	created_at: string;
}
interface CustomerAllResponse {
	items: CustomerEntity[];
	count: number;
	entity: 'collections'
}

interface CustomerCreateParams {
	name: string;
	email?: string;
	contact?: string;
	gstin?: string;
	notes?: Notes;
	fail_existing?: boolean;
}

export default function customers (api: API) {
	const MISSING_ID_ERROR = 'Customer ID is mandatory'

	return {
		async create (params: CustomerCreateParams) {
			return api.post<CustomerEntity>({
				url: '/customers',
				data: params
			})
		},

		async edit (customerId: string, params: CustomerCreateParams) {
			if (!customerId) {
				throw new RazorpayError('Missing parameter', MISSING_ID_ERROR)
			}

			return api.put({
				url: `/customers/${customerId}`,
				data: params
			})
		},

		async all () {
			return api.get<CustomerAllResponse>({ url: '/customers/' })
		},

		async fetch (customerId: string) {
			if (!customerId) {
				throw new RazorpayError('Missing parameter', MISSING_ID_ERROR)
			}
			return api.get({
				url: `/customers/${customerId}`
			})
		},

		async fetchTokens (customerId: string) {
			if (!customerId) {
				throw new RazorpayError('Missing parameter', MISSING_ID_ERROR)
			}
			return api.get({
				url: `/customers/${customerId}/tokens`
			})
		},

		async fetchToken (customerId: string, tokenId: string) {
			if (!customerId) {
				throw new RazorpayError('Missing parameter', MISSING_ID_ERROR)
			}
			if (!tokenId) {
				throw new RazorpayError('Missing parameter', 'Token ID is mandatory')
			}
			return api.get({
				url: `/customers/${customerId}/tokens/${tokenId}`
			})
		},

		async deleteToken (customerId: string, tokenId: string) {
			if (!customerId) {
				throw new RazorpayError('Missing parameter', MISSING_ID_ERROR)
			}
			if (!tokenId) {
				throw new RazorpayError('Missing parameter', 'Token ID is mandatory')
			}
			return api.delete<[]>({
				url: `/customers/${customerId}/tokens/${tokenId}`
			})
		}
	}
}

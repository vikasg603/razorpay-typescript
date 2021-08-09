'use strict'

/*
 * DOCS: https://razorpay.com/docs/invoices/
 */

import API from '../api'
import { SupportedCurrency } from '../types'
import { normalizeDate } from '../utils/razorpay-utils'
import RazorpayError from '../utils/RazorPayError'

export interface invoiceAllResponse {
	items: InvoiceEntity[];
	count: number;
	entity: 'collection';
}

export interface invoiceAllParams {
	from?: string | number | Date;
	to?: string | number | Date;
	count?: number;
	skip?: number;
}

export interface InvoiceCreateAddressEntity {
	line1: string;
	line2?: string;
	city: string;
	zipcode: string;
	state: string;
	country: string;
}

export interface InvoiceCreateLineItem {
	item_id?: string;
	name?: string;
	description?: string;
	amount?: number;
	quantity?: number;
	currency?: SupportedCurrency
}

export interface InvoiceCreateCustomerEntity {
	name: string;
	email?: string;
	contact?: string;
	billing_address: InvoiceCreateAddressEntity[];
	shipping_address: InvoiceCreateAddressEntity[];
}

export interface InvoiceCreatePrams {
	type: 'invoice',
	description: string;
	draft: string;
	customer_id?: string;
	customer: InvoiceCreateCustomerEntity;
	line_items: InvoiceCreateLineItem[];
	expire_by?: number;
	sms_notify?: 1 | 0;
	email_notify?: 1 | 0;
	partial_payment?: boolean;
	currency?: SupportedCurrency;
}

export interface InvoiceEntity {
  id: string
  entity: string
  receipt: any
  invoice_number: any
  customer_id: string
  customer_details: CustomerDetails
  order_id: string
  line_items: LineItem[]
  payment_id: any
  status: string
  expire_by: any
  issued_at: number
  paid_at: any
  cancelled_at: any
  expired_at: any
  sms_status: string
  email_status: string
  date: number
  terms: any
  partial_payment: boolean
  gross_amount: number
  tax_amount: number
  taxable_amount: number
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  description: any
  notes: any[]
  comment: any
  short_url: string
  view_less: boolean
  billing_start: any
  billing_end: any
  type: string
  group_taxes_discounts: boolean
  created_at: number
}

export interface CustomerDetails {
  id: string
  name: string
  email: string
  contact: string
  gstin: any
  billing_address: BillingAddress
  shipping_address: ShippingAddress
  customer_name: string
  customer_email: string
  customer_contact: string
}

export interface BillingAddress {
  id: string
  type: string
  primary: boolean
  line1: string
  line2: string
  zipcode: string
  city: string
  state: string
  country: string
}

export interface ShippingAddress {
  id: string
  type: string
  primary: boolean
  line1: string
  line2: string
  zipcode: string
  city: string
  state: string
  country: string
}

export interface LineItem {
  id: string
  item_id: any
  ref_id: any
  ref_type: any
  name: string
  description: string
  amount: number
  unit_amount: number
  gross_amount: number
  tax_amount: number
  taxable_amount: number
  net_amount: number
  currency: string
  type: string
  tax_inclusive: boolean
  hsn_code: any
  sac_code: any
  tax_rate: any
  unit: any
  quantity: number
  taxes: any[]
}

export default function invoicesApi (api: API) {
	const BASE_URL = '/invoices'
	const MISSING_ID_ERROR = 'Invoice ID is mandatory'

	/**
	 * Invoice entity gets used for both Payment Links and Invoices system.
	 * Few of the methods are only meaningful for Invoices system and
	 * calling those for against/for a Payment Link would throw
	 * Bad request error.
	 */

	return {

		async create (params: InvoiceCreatePrams) {
			/*
			* Creates invoice of any type(invoice|link|ecod).
			*
			* @param {Object} params
			* @param {Function} callback
			*
			* @return {Promise}
			*/

			const url = BASE_URL
			const data = params

			return api.post<InvoiceEntity>({
				url,
				data
			})
		},

		async edit (invoiceId: string, params: InvoiceCreatePrams) {
			/*
			* Patches given invoice with new attributes
			*
			* @param {String} invoiceId
			* @param {Object} params
			* @param {Function} callback
			*
			* @return {Promise}
			*/

			const url = `${BASE_URL}/${invoiceId}`
			const data = params

			if (!invoiceId) {
				throw new RazorpayError('Missing Parameter', MISSING_ID_ERROR)
			}

			return api.patch<InvoiceEntity>({
				url,
				data
			})
		},

		async issue (invoiceId: string) {
			/*
			* Issues drafted invoice
			*
			* @param {String} invoiceId
			* @param {Function} callback
			*
			* @return {Promise}
			*/

			if (!invoiceId) {
				throw new RazorpayError('Missing Parameter', MISSING_ID_ERROR)
			}

			const url = `${BASE_URL}/${invoiceId}/issue`

			return api.post<InvoiceEntity>({ url })
		},

		async delete (invoiceId: string) {
			/*
			* Deletes drafted invoice
			*
			* @param {String} invoiceId
			* @param {Function} callback
			*
			* @return {Promise}
			*/

			if (!invoiceId) {
				throw new RazorpayError('Missing Parameter', MISSING_ID_ERROR)
			}

			const url = `${BASE_URL}/${invoiceId}`

			return api.delete<[]>({ url })
		},

		async cancel (invoiceId: string) {
			/*
			* Cancels issued invoice
			*
			* @param {String} invoiceId
			* @param {Function} callback
			*
			* @return {Promise}
			*/

			if (!invoiceId) {
				throw new Error(MISSING_ID_ERROR)
			}

			const url = `${BASE_URL}/${invoiceId}/cancel`

			return api.post<InvoiceEntity>({ url })
		},

		async fetch (invoiceId: string) {
			/*
			* Fetches invoice entity with given id
			*
			* @param {String} invoiceId
			* @param {Function} callback
			*
			* @return {Promise}
			*/

			if (!invoiceId) {
				return Promise.reject(MISSING_ID_ERROR)
			}

			const url = `${BASE_URL}/${invoiceId}`

			return api.get<InvoiceEntity>({
				url
			})
		},

		async all (params: invoiceAllParams = {}) {
			/*
			* Fetches multiple invoices with given query options
			*
			* @param {Object} invoiceId
			* @param {Function} callback
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

			return api.get<invoiceAllResponse>({
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

		async notifyBy (invoiceId: string, medium: string) {
			/*
			* Send/re-send notification for invoice by given medium
			*
			* @param {String} invoiceId
			* @param {String} medium
			* @param {Function} callback
			*
			* @return {Promise}
			*/

			if (!invoiceId) {
				throw new RazorpayError('Missing Parameter', MISSING_ID_ERROR)
			}

			if (!medium) {
				throw new RazorpayError('Missing Parameter', '`medium` is required')
			}

			const url = `${BASE_URL}/${invoiceId}/notify_by/${medium}`

			return api.post<{success: true}>({ url })
		}
	}
}

'use strict'

import API from '../api'
import RazorpayError from '../utils/RazorPayError'

/*
 * DOCS: https://razorpay.com/docs/subscriptions/api/
 */

export interface AddonEntity {
  id: string
  entity: string
  item: AddonItem
  quantity: number
  created_at: number
  subscription_id: string
  invoice_id: any
}

export interface AddonItem {
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

export default function addon (api: API) {
	const BASE_URL = '/addons'
	const MISSING_ID_ERROR = 'Addon ID is mandatory'

	return {

		async fetch (addonId: string) {
			/*
       * Fetches addon given addon id
       * @param {String} addonId
       * @param {Function} callback
       *
       * @return {Promise}
       */

			if (!addonId) {
				throw new RazorpayError('Missing parameter', MISSING_ID_ERROR)
			}

			const url = `${BASE_URL}/${addonId}`

			return api.get<AddonEntity>({ url })
		},

		async delete (addonId: string) {
			/*
       * Deletes addon given addon id
       * @param {String} addonId
       * @param {Function} callback
       *
       * @return {Promise}
       */

			if (!addonId) {
				throw new RazorpayError('Missing parameter', MISSING_ID_ERROR)
			}

			const url = `${BASE_URL}/${addonId}`

			return api.delete<[]>({ url })
		}
	}
}

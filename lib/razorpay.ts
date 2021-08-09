'use strict'

import API from './api'
import addonsResource from './resources/addons'
import customersResource from './resources/customers'
import invoicesResource from './resources/invoices'
import ordersResource from './resources/orders'
import paymentLinksResource from './resources/paymentLinks'
import paymentsResource from './resources/payments'
import plansResource from './resources/plans'
import refundsResource from './resources/refunds'
import subscriptionsResource from './resources/subscriptions'
import transfersResource from './resources/transfers'
import virtualAccountsResource from './resources/virtualAccounts'
import { validateWebhookSignature } from './utils/razorpay-utils'

class Razorpay {
	static VERSION = process.env.npm_package_version || '1.0.0';
	key_id: string;
	key_secret: string;
	api: API;

	static validateWebhookSignature (body: string, signature: string, secret: string) {
		return validateWebhookSignature(body, signature, secret)
	}

	constructor (options: { key_id: string, key_secret: string, headers?: { [key: string]: string } } = { key_id: '', key_secret: '' }) {
		const { key_id, key_secret, headers } = options

		if (!key_id) {
			throw new Error('`key_id` is mandatory')
		}

		if (!key_secret) {
			throw new Error('`key_secret` is mandatory')
		}

		this.key_id = key_id
		this.key_secret = key_secret

		this.api = new API({
			hostUrl: 'https://api.razorpay.com/v1/',
			ua: `razorpay-node@${Razorpay.VERSION}`,
			key_id,
			key_secret,
			headers
		})
		this.addResources()
	}

	addResources () {
		Object.assign(this, {
			payments: paymentsResource(this.api),
			paymentLinks: paymentLinksResource(this.api),
			refunds: refundsResource(this.api),
			orders: ordersResource(this.api),
			customers: customersResource(this.api),
			transfers: transfersResource(this.api),
			virtualAccounts: virtualAccountsResource(this.api),
			invoices: invoicesResource(this.api),
			plans: plansResource(this.api),
			subscriptions: subscriptionsResource(this.api),
			addons: addonsResource(this.api)
		})
	}
}

module.exports = Razorpay

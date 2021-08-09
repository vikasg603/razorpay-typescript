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
	payments: ReturnType<typeof paymentsResource>;
	paymentLinks: ReturnType<typeof paymentLinksResource>;
	refunds: ReturnType<typeof refundsResource>;
	orders: ReturnType<typeof ordersResource>;
	customers: ReturnType<typeof customersResource>;
	transfers: ReturnType<typeof transfersResource>;
	virtualAccounts: ReturnType<typeof virtualAccountsResource>;
	invoices: ReturnType<typeof invoicesResource>;
	plans: ReturnType<typeof plansResource>;
	subscriptions: ReturnType<typeof subscriptionsResource>;
	addons: ReturnType<typeof addonsResource>;

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
		this.payments = paymentsResource(this.api)
		this.paymentLinks = paymentLinksResource(this.api)
		this.refunds = refundsResource(this.api)
		this.orders = ordersResource(this.api)
		this.customers = customersResource(this.api)
		this.transfers = transfersResource(this.api)
		this.virtualAccounts = virtualAccountsResource(this.api)
		this.invoices = invoicesResource(this.api)
		this.plans = plansResource(this.api)
		this.subscriptions = subscriptionsResource(this.api)
		this.addons = addonsResource(this.api)
	}
}

export default Razorpay

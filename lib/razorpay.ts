'use strict'

// @ts-ignore
import npmPackage from '../package.json'
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
import RazorpayError from './utils/RazorPayError'

class Razorpay {
	static VERSION = npmPackage.version || '1.0.0';
	static PACKAGE_NAME = npmPackage.name || 'razorpay-node-typescript';
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
			throw new RazorpayError('Missing parameter', '`key_id` is mandatory')
		}

		if (!key_secret) {
			throw new RazorpayError('Missing parameter', '`key_secret` is mandatory')
		}

		const api = new API({
			hostUrl: 'https://api.razorpay.com/v1/',
			ua: `${Razorpay.PACKAGE_NAME}@${Razorpay.VERSION}`,
			key_id,
			key_secret,
			headers
		})
		this.payments = paymentsResource(api)
		this.paymentLinks = paymentLinksResource(api)
		this.refunds = refundsResource(api)
		this.orders = ordersResource(api)
		this.customers = customersResource(api)
		this.transfers = transfersResource(api)
		this.virtualAccounts = virtualAccountsResource(api)
		this.invoices = invoicesResource(api)
		this.plans = plansResource(api)
		this.subscriptions = subscriptionsResource(api)
		this.addons = addonsResource(api)
	}
}

export default Razorpay

module.exports = Razorpay

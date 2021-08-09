import crypto from 'crypto'

export function getDateInSecs (date: string | number | Date) {
	return (+new Date(date)) / 1000
}

export function isNumber (num: number | string | Date) {
	return !isNaN(Number(num))
}

export function normalizeDate (date: number | string | Date) {
	return isNumber(date) ? date : getDateInSecs(date)
}

export function isNonNullObject (input: any) {
	return !!input &&
         typeof input === 'object' &&
         !Array.isArray(input)
}

export function normalizeBoolean (bool: any) {
	if (bool === undefined) {
		return bool
	}

	return bool ? 1 : 0
}

export function isDefined (value: any) {
	return typeof value !== 'undefined'
}

export function normalizeNotes (notes: {[key: string]: string} = {}) {
	const normalizedNotes: {[key: string]: string} = {}
	if (!isNonNullObject(notes)) {
		return normalizedNotes
	}
	for (const key in notes) {
		normalizedNotes[`notes[${key}]`] = notes[key]
	}
	return normalizedNotes
}

export function prettify (val: {[key: string]: any}) {
	/*
   * given an object , returns prettified string
   *
   * @param {Object} val
   * @return {String}
   */

	return JSON.stringify(val, null, 2)
}

export function getTestError (summary: string, expectedVal: any, gotVal: any) {
	/*
   * @param {String} summary
   * @param {*} expectedVal
   * @param {*} gotVal
   *
   * @return {Error}
   */

	return new Error(
		`\n${summary}\n` +
    `Expected(${typeof expectedVal})\n${prettify(expectedVal)}\n\n` +
    `Got(${typeof gotVal})\n${prettify(gotVal)}`
	)
}

export function validateWebhookSignature (body: string, signature: string, secret: string) {
	/*
   * Verifies webhook signature
   *
   * @param {String} summary
   * @param {String} signature
   * @param {String} secret
   *
   * @return {Boolean}
   */

	if (!isDefined(body) ||
      !isDefined(signature) ||
      !isDefined(secret)) {
		throw Error(
			'Invalid Parameters: Please give request body,' +
      'signature sent in X-Razorpay-Signature header and ' +
      'webhook secret from dashboard as parameters'
		)
	}

	body = body.toString()

	const expectedSignature = crypto.createHmac('sha256', secret)
		.update(body)
		.digest('hex')

	return expectedSignature === signature
};

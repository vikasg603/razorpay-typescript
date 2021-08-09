class RazorpayError extends Error {
	statusCode: number;
	error: { [key: string]: any; };
	constructor (message: string, error?: {[key: string]: any} | string, statusCode?: number | undefined) {
		super(message)
		this.statusCode = statusCode || -1
		if (typeof error === 'string') {
			this.error = { message: error }
		} else {
			this.error = error || {}
		}
	}
}

export default RazorpayError

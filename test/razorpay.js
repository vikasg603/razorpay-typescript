'use strict'

const Razorpay = require('../dist/razorpay').default

module.exports = new Razorpay({
	key_id: 'XXX',
	key_secret: 'YYY'
})

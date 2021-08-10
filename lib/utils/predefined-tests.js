'use strict'

const mocker = require('../../test/mocker')
const equal = require('deep-equal')
const chai = require('chai')
const { assert } = chai
const {
	prettify,
	getTestError
} = require('../../dist/utils/razorpay-utils')

const runCallbackCheckTest = (params) => {
	const {
		apiObj,
		methodName,
		methodArgs,
		mockerParams
	} = params

	it('Checks if the passed api callback gets called', (done) => {
		mocker.mock(mockerParams)

		apiObj[methodName](...methodArgs, () => {
			done()
		})
	})

	it('Checks for error flow', (done) => {
		mocker.mock({ ...mockerParams, replyWithError: true })

		apiObj[methodName](...methodArgs, (err) => {
			assert.ok(!!err, 'Error callback called with error')
			done()
		})
	})

	it('Checks if the api call returns a Promise', (done) => {
		mocker.mock(mockerParams)

		const retVal = apiObj[methodName](...methodArgs)

		retVal && typeof retVal.then === 'function'
			? done()
			: done(getTestError('Invalid Return Value', String('Promise'), retVal))
	})
}

const runURLCheckTest = (params) => {
	const {
		apiObj,
		methodName,
		methodArgs,
		expectedUrl,
		mockerParams
	} = params

	it('Checks if the URL is formed correctly', (done) => {
		mocker.mock(mockerParams)

		apiObj[methodName](...methodArgs, (_err, resp) => {
			const respData = resp.__JUST_FOR_TESTS__

			if (respData.url === expectedUrl) {
				assert.ok(true, 'URL Matched')
				done()
			} else {
				done(getTestError(
					'URL Mismatch',
					expectedUrl,
					respData.url
				))
			}
		})
	})
}

const runParamsCheckTest = (params) => {
	let {
		apiObj,
		methodName,
		methodArgs,
		expectedParams,
		mockerParams,
		testTitle
	} = params

	testTitle = testTitle || 'Validates URL and Params'

	it(testTitle, (done) => {
		mocker.mock(mockerParams)

		apiObj[methodName](...methodArgs).then((resp) => {
			const respData = resp.__JUST_FOR_TESTS__
			const respParams = respData[respData.method === 'GET'
				? 'requestQueryParams'
				: 'requestBody']

			if (equal(respParams, expectedParams)) {
				assert.ok(true, 'Params Matched')
			} else {
				return getTestError(
					'Params Mismatch',
					expectedParams,
					respParams
				)
			}
		}, (err) => {
			return new Error(prettify(err))
		}).then((err) => {
			done(err)
		})
	})
}

const runCommonTests = (params) => {
	const {
		apiObj,
		methodName,
		methodArgs,
		expectedUrl,
		expectedParams,
		mockerParams
	} = params

	runURLCheckTest({
		...params
	})

	if (expectedParams) {
		runParamsCheckTest({
			...params
		})
	}

	runCallbackCheckTest({
		...params
	})
}

module.exports = {
	runCallbackCheckTest,
	runParamsCheckTest,
	runURLCheckTest,
	runCommonTests
}

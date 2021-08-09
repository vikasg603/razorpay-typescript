'use strict'

const chai = require('chai')
const { assert } = chai
const rzpInstance = require('../razorpay')
const mocker = require('../mocker')

const SUB_PATH = '/addons'
const FULL_PATH = `/v1${SUB_PATH}`
const TEST_ADDON_ID = 'addon_sometestid'
const apiObj = rzpInstance.addons

const { runCommonTests } = require('../../dist/utils/predefined-tests.js')

const runIDRequiredTest = (params) => {
	const { apiObj, methodName, methodArgs, mockerParams } = params

	mocker.mock(mockerParams)

	it(`method ${methodName} checks for Addon ID as param`,
		(done) => {
			apiObj[methodName](...methodArgs).then(() => {
				done(new Error(`method ${methodName} does not` +
                     ' check for Addon ID'))
			}, (err) => {
				done()
			})
		})
}

describe('Addons', () => {
	describe('Fetch Addon', () => {
		const expectedUrl = `${FULL_PATH}/${TEST_ADDON_ID}`
		const methodName = 'fetch'
		const methodArgs = [TEST_ADDON_ID]
		const mockerParams = {
			url: `${SUB_PATH}/${TEST_ADDON_ID}`
		}

		runIDRequiredTest({
			apiObj,
			methodName,
			methodArgs: [undefined],
			mockerParams: {
				url: `${SUB_PATH}/${undefined}`
			}
		})

		runCommonTests({
			apiObj,
			methodName,
			methodArgs,
			mockerParams,
			expectedUrl
		})
	})

	describe('Delete Addon', () => {
		const expectedUrl = `${FULL_PATH}/${TEST_ADDON_ID}`
		const methodName = 'delete'
		const methodArgs = [TEST_ADDON_ID]
		const mockerParams = {
			url: `${SUB_PATH}/${TEST_ADDON_ID}`,
			method: 'DELETE'
		}

		runIDRequiredTest({
			apiObj,
			methodName,
			methodArgs: [undefined],
			mockerParams: {
				url: `${SUB_PATH}/${undefined}`,
				method: 'DELETE'
			}
		})

		runCommonTests({
			apiObj,
			methodName,
			methodArgs,
			mockerParams,
			expectedUrl
		})
	})
})

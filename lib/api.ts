'use strict'

import axios, { AxiosError, AxiosInstance } from 'axios'

import { isNonNullObject } from './utils/razorpay-utils'
import RazorpayError from './utils/RazorPayError'

const allowedHeaders = {
	'X-Razorpay-Account': ''
}

function getValidHeaders (headers?: { [key: string]: string }) {
	const result: { [key: string]: string } = {}

	if (!headers || !isNonNullObject(headers)) {
		return result
	}

	return Object.keys(headers).reduce(function (result, headerName) {
		if (Object.prototype.hasOwnProperty.call(allowedHeaders, headerName)) {
			result[headerName] = headers[headerName]
		}

		return result
	}, result)
}

class API {
	axiosInstance: AxiosInstance;
	constructor (options: { hostUrl?: string; ua: string; key_id: string; key_secret: string; headers?: { [key: string]: string }; }) {
		this.axiosInstance = axios.create({
			baseURL: options.hostUrl,
			headers: Object.assign(
				{ 'User-Agent': options.ua },
				getValidHeaders(options.headers)
			),
			auth: {
				username: options.key_id,
				password: options.key_secret
			}
		})
	}

	async get<ResponseType = any> (params: { url: string; data?: any; }) {
		return await this.axiosInstance.get<ResponseType>(params.url, { params: params.data }).then(({ data }) => data).catch((response: AxiosError) => {
			throw new RazorpayError('API Error', response.response?.data.error || {}, response.response?.status)
		})
	}

	async post<ResponseType = any> (params: { url: string; data?: any; }) {
		return await this.axiosInstance.post<ResponseType>(params.url, params.data).then(({ data }) => data).catch((response: AxiosError) => {
			throw new RazorpayError('API Error', response.response?.data.error || {}, response.response?.status)
		})
	}

	async put<ResponseType = any> (params: { url: string; data: any; }) {
		return await this.axiosInstance.put<ResponseType>(params.url, params.data).then(({ data }) => data).catch((response: AxiosError) => {
			throw new RazorpayError('API Error', response.response?.data.error || {}, response.response?.status)
		})
	}

	async patch<ResponseType = any> (params: { url: string; data: any; }) {
		return await this.axiosInstance.patch<ResponseType>(params.url, params.data).then(({ data }) => data).catch((response: AxiosError) => {
			throw new RazorpayError('API Error', response.response?.data.error || {}, response.response?.status)
		})
	}

	async delete<ResponseType = any> (params: { url: string; }) {
		return await this.axiosInstance.delete<ResponseType>(params.url).then(({ data }) => data).catch((response: AxiosError) => {
			throw new RazorpayError('API Error', response.response?.data.error || {}, response.response?.status)
		})
	}
}

export default API

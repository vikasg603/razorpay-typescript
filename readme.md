
# Razorpay Node SDK

[![npm](https://img.shields.io/npm/v/razorpay-node-typescript.svg?maxAge=2592000?style=flat-square)](https://www.npmjs.com/package/razorpay-node-typescript)

Unofficial nodejs library for [Razorpay API](https://docs.razorpay.com/docs/payments) with typescript support.

Read up here for getting started and understanding the payment flow with Razorpay: [https://docs.razorpay.com/docs/getting-started](https://docs.razorpay.com/docs/getting-started)

## Why this library?

1.  typescript support.
2.  Removed legacy callbacks ( If you were using the promise API, then you don't have to change anything at all)
3.  Improved code to not require any module inside the function (This was the major reason I opted to create my own library, as requiring module is CPU intensive synchronous task, and requiring it inside the function can block other requests)
4.  Added support for payment-links
5.  Removed deprecated request and request-promise and shifted to Axios.
6.  Removed the legacy error handling where you have to handle the synchronous and promise errors (added the standard RazorpayError class for handling all the errors).
7.  Any many more reasons

## Installation

```bash
npm i razorpay-node-typescript
```

## Documentation

Documentation of Razorpay's API and their usage is available at [https://docs.razorpay.com](https://docs.razorpay.com)

### Basic Usage

Instantiate the razorpay instance with `key_id` & `key_secret`. You can obtain the keys from the dashboard app ([https://dashboard.razorpay.com/#/app/keys](https://dashboard.razorpay.com/#/app/keys))

```js
var instance = new Razorpay({
  key_id: 'YOUR_KEY_ID',
  key_secret: 'YOUR_KEY_SECRET',
});
```

The resources can be accessed via the instance. All the methods invocations follows the namespaced signature

```js
// API signature
// {razorpayInstance}.{resourceName}.{methodName}(resourceId [, params])

// example
instance.payments.fetch(paymentId);
```

Every resource method returns a promise.

```js
instance.payments
  .all({
    from: '2016-08-01',
    to: '2016-08-20',
  })
  .then(response => {
    // handle success
  })
  .catch(error => {
    // handle error
  });
```

## Error Handling

This library comes with the standard way of handling all the erros originated by the razorpay.
The Error object comes with following keys and value

 1. message:
	 1. "Missing Parameter" : If any mandatory key is missing
	 2. "API Error" : When the Error is came from the API
 2. statusCode:
	 1. -1 : When Missing Parameter
	 2. Http Error code in all other cases
3. error:
	1. This is a object which contains the error message came from the razorpay api
	2. On the case of missing parameter it will be {message: 'paramter which is missing'} 

---

## Development

```bash
npm install
```

## Testing

```bash
npm test
```

## Release

1. Switch to `master` branch. Make sure you have the latest changes in the local master
2. Update the `CHANGELOG.md` & bump the version in `package.json`
3. Commit
4. Tag the release & push to Github
5. Create a release on GitHub using the website with more details about the release
6. Publish to npm with `npm publish` command

## Licence

MIT Licensed. See [LICENSE.txt](LICENSE.txt) for more details

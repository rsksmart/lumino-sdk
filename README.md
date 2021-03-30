
# Lumino JavaScript SDK

This library works as a client for the lumino node. Developers can use this to integrate their services with lumino
using javascript. This code provides an easy interface to communicate with Lumino's REST API and request the information required.
For that purpose, many ES2015 features were used, as well as Promises notation to help dealing with asynchronous code.

## Requirements
In order to use this SDK, you'll need the following tools:

* [Node.js **v6.3.0 or above**](https://nodejs.org/)

Node installation will include [NPM](https://www.npmjs.com/), which is responsible for the dependencies management.

## Installation

### Browser

1. Checkout the repository `git clone git@github.com:Lumino/lumino-js-sdk.git`.
2. Go to the `lumino-js-sdk` directory.
3. Run `npm install`.
4. Run `npm run bundle` to generate a bundle.js inside the `dist` folder ready to be used in the browser.
5. Use the content generated in `dist` folder to use the SDK in your code.
6. Include it in your page like this: `<script src="path/to/bundle.js"></script>` .

## Usage

This SDK relies heavily on [Promises](https://developers.google.com/web/fundamentals/getting-started/primers/promises), 
making it easier to handle the asynchronous requests made to the API. Besides that, it provides a `Lumino` object 
containing several methods corresponding to the calls to be performed.

This is a generic example of how to use the SDK, if you need specific details for a specific module, 
refer to [samples folder](./samples).

Before executing any request, you need to call the constructor passing the initial configuration for the SDK like this:

```js
const lumino = new Lumino({    
    luminoNodeBaseUrl: "http://api-url.lumino-node/api/v1/"
});
```

From this point on, you just need to call the available methods inside the lumino object to call the API and retrieve
the data you're looking for. Following the Promises notation, you should use `.then()`/`.catch()` to handle respectively 
the successful and failed requests.

Except for some special cases, most of the calls only take an object as parameter. After that, you'll need to refer 
to the API to tune the query as intended.

```js

	lumino.getChannels({
	    token_addresses: '0x714E99c00D4Abf4a8a2Af90Fd40B595C68801C42'
	})  
    .then((data) => {  
        // TODO stuff 
    })  
    .catch((error) => {  
        // TODO Handle the error 
    });

```

## Methods available
Here's a list of all the methods available:

* `getPayments(object)`
* `getTokens()`
* `getJoinableChannels(string)`
* `getChannels(string)`
* `getChannel(object)`
* `search(object)`
* `openChannel(object)`
* `closeChannel(object)`
* `makePayment(object)`
* `depositTokens(object)`
* `leaveNetwork(string)`


## Contribute to the SDK

If you wish to contribute to this repository and further extend the API coverage of the SDK,
here are the steps necessary to prepare your environment:

1. Clone the repository
2. In the root folder, run `npm install` to install all the dependencies.
3. Edit the file named `setup.json` to provide API SDK config params following this structure:
```json
{
  "luminoNodeBaseUrl": "http://localhost:5000/api/v1/",
  "sampleParams": {
    "amountOnWei": 1,
    "tokenAddress": "0x47E5b7d85Da2004781FeD64aeEe414eA9CdC4f17",
    "partnerAddress": "0xb69755ee7da32BF1853cFb77cC353f8A03677AA7"
  }
}

```
* sampleParams are optional but we recommend to put real values there since are neccesary to run the samples

4.Use any of these commands to:
  1. `npm run lint` - Run ESlint and check the code.
  2. `npm run bundle` - Run webpack to bundle the code in order to run in a browser.
  3. `npm run dist` or `npm run build` - Run Babel to create a folder 'dist' with ES2015 compatible code.
  4. `npm test` - Run Jest for all the spec files inside 'tests'.
  5. `npm run doc` - Run JSDoc to create a 'doc' folder with generated documentation for the source code, also 
     it starts a web server at `localhost:8085` to serve the doc files.
  6. `npm start` - Deploy a web server at `localhost:8085` to run the html samples (in order to avoid CORS problems).
  7. `npm run prettier` - to run [prettier](https://www.npmjs.com/package/prettier) on the SDK code. 

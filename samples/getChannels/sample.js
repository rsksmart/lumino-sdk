function runSample(lumino) {
    return new Promise((resolve) => {
        const result = {
            callWithoutParams: null,
            callWithParams: null
        }
        lumino.getChannels().subscribe(response => {
            result.callWithoutParams = response;
        }, error => {
            result.callWithoutParams = error;
        });
    });
}


const Lumino = require('../dist/lumino-js-sdk.js').default;
const configs = require('../sdk-config');

const lumino = new Lumino(configs);

lumino.getChannels()
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.error(error);
    });

var Lumino = Lumino.default;

let configs = {};
configs['luminoNodeBaseUrl'] = 'http://localhost:5001/api/v1/';

let params = {};
params['token_addresses'] = "0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d";

const lumino = new Lumino(configs);

lumino.getChannels(params)
    .then((data) => {
        document.getElementById("json").innerHTML = JSON.stringify(data, undefined, 2);
    })
    .catch((error) => {
        console.error(error);
    });

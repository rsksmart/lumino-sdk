const Lumino = require('../dist/lumino-js-sdk.js').default;
const configs = require('../sdk-config');

const lumino = new Lumino(configs);

lumino.getPayments()
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.error(error);
    });

const Lumino = Lumino.default;

let configs = {};
configs['luminoNodeBaseUrl'] = 'http://localhost:5001/api/v1/';

let params = {};
params['limit'] = 10;

const lumino = new Lumino(configs);

lumino.getPayments(params)
    .then((data) => {
        document.getElementById("json").innerHTML = JSON.stringify(data, undefined, 2);
    })
    .catch((error) => {
        console.error(error);
    });

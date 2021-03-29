const Lumino = require('../dist/lumino-js-sdk.js').default;
const configs = require('../sdk-config');

const lumino = new Lumino(configs);

const params = {query:2};

lumino.search(params)
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
params['query'] = 2;

const lumino = new Lumino(configs);

lumino.search(params)
    .then((data) => {
        document.getElementById("json").innerHTML = JSON.stringify(data, undefined, 2);
    })
    .catch((error) => {
        console.error(error);
    });

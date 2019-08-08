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

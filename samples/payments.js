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

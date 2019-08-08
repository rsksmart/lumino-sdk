const Lumino = require('../dist/lumino-js-sdk.js').default;
const configs = require('../sdk-config');

let data = {};
data.state = "closed";

let params = {};
params.tokenAddress = "0x714E99c00D4Abf4a8a2Af90Fd40B595C68801C42"; // PEPE TOKEN
params.partnerAddress = "0x3E5B85E29504522DCD923aa503b4C502A64AdB7C";

const lumino = new Lumino(configs);

lumino.closeChannel(data, params)
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.error(error);
    });

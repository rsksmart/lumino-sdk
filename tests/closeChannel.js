/* eslint-env jasmine */

const Lumino = require('../dist/lumino-js-sdk').default;
const configs = require('../sdk-config');

describe('Channels Close RSK address', () => {
    var originalTimeout;
    let lumino;
    let responseCloseChannelByRskAddress;

    beforeAll(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    });

    beforeEach((done) => {

        const pepe3Token = "0x23d078ec6eFD5F692e6ff54fc35E6818C192D3b3";

        let params = {};
        params.partnerAddress = "0xfb1efeBeA740a9b4820d287d6DcC1cb30F1bA1c8"; // node in 5003
        params.tokenAddress = pepe3Token;

        let data = {};
        data.state = "closed";

        lumino = new Lumino(configs);

        lumino.closeChannel(data, params)
            .then((response) => {
                responseCloseChannelByRskAddress = response;
                done();
            })
            .catch((error) => {
                responseCloseChannelByRskAddress = error;
                done();
            });

    });

    it('should close channel with rsk partner address', (done) => {
        expect(responseCloseChannelByRskAddress.hasOwnProperty("channel_identifier")).toEqual(true);
        done();
    });

});

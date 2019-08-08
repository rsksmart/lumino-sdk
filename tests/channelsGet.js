/* eslint-env jasmine */

const Lumino = require('../dist/lumino-js-sdk').default;
const configs = require('../sdk-config');

describe('Channels', () => {
    var originalTimeout;
    let lumino;
    let channels;
    let responseNewChannelByRskAddress;

    beforeAll(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    });

    beforeEach((done) => {

        const pepe3Token = "0x23d078ec6eFD5F692e6ff54fc35E6818C192D3b3";

        // Info to get channels
        let params = {};
        params['token_addresses'] = pepe3Token;

        lumino = new Lumino(configs);

        let promiseGetChannels = lumino.getChannels(params)
            .then((data) => {
                channels = data;
                done();
            })
            .catch((error) => {
                channels = error;
                done();
            });

    });

    it('should get active channels', (done) => {
        expect(Array.isArray(channels)).toEqual(true);
        done();
    });

});

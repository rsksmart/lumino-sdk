/* eslint-env jasmine */

const Lumino = require('../dist/lumino-js-sdk').default;
const configs = require('../sdk-config');

describe('Channels Open RNS address', () => {
    var originalTimeout;
    let lumino;
    let responseNewChannelByRskAddress;

    beforeAll(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    });

    beforeEach((done) => {

        const pepe3Token = "0x23d078ec6eFD5F692e6ff54fc35E6818C192D3b3";

        // Info to create channel with rsk address partner
        let dataOne = {};
        dataOne.rnsPartnerAddress = "gaspar3.rsk.co"; // node in 5003
        dataOne.tokenAddress = pepe3Token;
        dataOne.amount = 10;

        lumino = new Lumino(configs);

        lumino.openChannel(dataOne)
            .then((data) => {
                responseNewChannelByRskAddress = data;
                done();
            })
            .catch((error) => {
                responseNewChannelByRskAddress = error;
                done();
            });

    });

    it('should open a new channel with rns partner address', (done) => {
        expect(responseNewChannelByRskAddress.hasOwnProperty("channel_identifier")).toEqual(true);
        done();
    });

});

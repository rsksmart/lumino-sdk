/* eslint-env jasmine */

const Lumino = require('../dist/lumino-js-sdk').default;
const configs = require('../sdk-config');

describe('Make Payment', () => {
    var originalTimeout;
    let lumino;
    let responseMakePayment;

    beforeAll(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;
    });

    beforeEach((done) => {

        const pepe3Token = "0x23d078ec6eFD5F692e6ff54fc35E6818C192D3b3";

        let params = {};
        params.partnerAddress = "0x3E5B85E29504522DCD923aa503b4C502A64AdB7C"; // node in 5002
        params.tokenAddress = pepe3Token;

        let data = {};
        data.amount = 1;

        lumino = new Lumino(configs);

        lumino.makePayment(data, params)
            .then((response) => {
                responseMakePayment = response;
                done();
            })
            .catch((error) => {
                responseMakePayment = error;
                done();
            });

    });

    it('should make a payment', (done) => {
        expect(responseMakePayment.hasOwnProperty("identifier")).toEqual(true);
        done();
    });

});

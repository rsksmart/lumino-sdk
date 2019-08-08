/* eslint-env jasmine */

const Lumino = require('../dist/lumino-js-sdk').default;
const configs = require('../sdk-config');

describe('Tokens', () => {
    var originalTimeout;
    let lumino;
    let tokens;

    beforeAll(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    });

    beforeEach((done) => {
        lumino = new Lumino(configs);

        lumino.getTokens()
            .then((data) => {
                tokens = data;
                done();
            })
            .catch((error) => {
                tokens = error;
                done();
            });

    });

    it('should get tokens with details', (done) => {
        expect(Array.isArray(tokens)).toEqual(true);
        expect(tokens.length > 0);
        done();
    });

});

/* eslint-env jasmine */

const Lumino = require('../dist/lumino-js-sdk').default;
const configs = require('../sdk-config');

describe('Search', () => {
    var originalTimeout;
    let lumino;
    let searchResult;
    let tokenAddress;
    let queryMatchRandom;

    beforeAll(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
    });

    beforeEach((done) => {
        let params = {};
        tokenAddress = "0x714E99c00D4Abf4a8a2Af90Fd40B595C68801C42";
        queryMatchRandom = 2;

        params['query'] = tokenAddress;

        lumino = new Lumino(configs);

        let promiseSearchResultOne = lumino.search(params)
            .then((data) => {
                searchResult = data;
                done();
            })
            .catch((error) => {
                searchResult = error;
                done();
            });

        let promiseSearchResultRandomMatch = lumino.search(params)
            .then((data) => {
                searchResult = data;
                done();
            })
            .catch((error) => {
                searchResult = error;
                done();
            });

        Promise.all([promiseSearchResultOne, promiseSearchResultRandomMatch]).then(() => {
            done();
        });

    });

    it('should get a specific token', (done) => {
        expect(Array.isArray(searchResult.results.token_address_matches)).toEqual(true);
        expect(searchResult.results.token_address_matches.length > 0);
        expect(searchResult.results.token_address_matches.includes(tokenAddress));
        done();
    });

    it('should get a results matches with random match', (done) => {
        expect(Array.isArray(searchResult.results.token_address_matches)).toEqual(true);
        expect(Array.isArray(searchResult.results.node_address_matches)).toEqual(true);
        expect(searchResult.results.token_address_matches.includes(queryMatchRandom));
        expect(searchResult.results.node_address_matches.includes(queryMatchRandom));
        done();
    });

});

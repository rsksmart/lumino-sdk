/* eslint-env jasmine */

const Lumino = require('../dist/lumino-js-sdk').default;
const configs = require('../sdk-config');

describe('Payments', () => {
    var originalTimeout;
    let lumino;
    let allPayments;
    let limitPayments;

    beforeAll(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    });

    beforeEach((done) => {
        let params = {};
        params['limit'] = 1;

        lumino = new Lumino(configs);

        let allPaymentsPromise = lumino.getPayments()
            .then((data) => {
                allPayments = data;
            })
            .catch((error) => {
                allPayments = error;
                done();
            });

        let limitPaymentsPromise = lumino.getPayments(params)
            .then((data) => {
                limitPayments = data;
            })
            .catch((error) => {
                limitPayments = error;
                done();
            });

        Promise.all([allPaymentsPromise, limitPaymentsPromise]).then(() => {
            done();
        });


    });

    it('should get all the payments', (done) => {
        expect(Array.isArray(allPayments)).toEqual(true);
        done();
    });

    it('should get limit payments', (done) => {
        expect(limitPayments.length).toEqual(1);
        expect(Array.isArray(limitPayments)).toEqual(true);
        done();
    });
});

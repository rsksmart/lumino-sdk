
jest.mock('../src/utils');

import Lumino from '../src';
import config from '../setup'
import {createClient} from '../src/utils';

describe('Payments', () => {
    let lumino;
    let mockAxios;

    beforeEach(() => {
        lumino = new Lumino({ ...config });
        mockAxios = createClient();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should get all payments', (done) => {
        const expected = [
        ];
        mockAxios.get.mockResolvedValue({ data: expected });
        lumino.getChannels().subscribe(actual => {
            expect(mockAxios.get).toHaveBeenCalledTimes(1);
            expect(actual).toBe(expected);
            done();
        }, () => done.fail());
    });


});

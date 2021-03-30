
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

    it('should get all payments', async () => {
        const expected = [
        ];
        mockAxios.get.mockResolvedValue({ data: expected });
        const actual = await lumino.getPayments();
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(actual).toBe(expected);
    });


});

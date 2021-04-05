
jest.mock('../src/utils');

import Lumino from '../src';
import config from '../setup'
import { createClient } from '../src/utils';

describe('Address', () => {
    let lumino;
    let mockAxios;

    beforeEach(() => {
        lumino = new Lumino({ ...config });
        mockAxios = createClient();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should get our address', async () => {
        const expected = {
            our_address: "0x2Cd53d83E5ca1F3c66EDC7bf307139c6B1989C9a"
        }
        mockAxios.get.mockResolvedValue({ data: expected });
        const actual = await lumino.getAddress();
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(mockAxios.get).toHaveBeenCalledWith("address");
        expect(actual).toBe(expected);
    });

});

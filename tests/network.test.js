
jest.mock('../src/utils');

import Lumino from '../src';
import config from '../setup'
import { createClient } from '../src/utils';

describe('connections', () => {
    let lumino;
    let mockAxios;

    beforeEach(() => {
        lumino = new Lumino({ ...config });
        mockAxios = createClient();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('join network', async () => {
        const expected = {status: 204};
        mockAxios.put.mockResolvedValue(expected);
        const actual = await lumino.joinNetwork({
            tokenAddress: '0x47E5b7d85Da2004781FeD64aeEe414eA9CdC4f17',
            fundsOnWei: 100
        });
        expect(mockAxios.put).toHaveBeenCalledTimes(1);
        expect(mockAxios.put).toHaveBeenCalledWith('connections/0x47E5b7d85Da2004781FeD64aeEe414eA9CdC4f17', {
            funds: 100
        });
        expect(actual).toBe(expected);
    });

    it('leave network', async () => {
        mockAxios.delete.mockResolvedValue({data: []});
        const actual = await lumino.leaveNetwork('0x47E5b7d85Da2004781FeD64aeEe414eA9CdC4f17');
        expect(mockAxios.delete).toHaveBeenCalledTimes(1);
        expect(mockAxios.delete).toHaveBeenCalledWith('connections/0x47E5b7d85Da2004781FeD64aeEe414eA9CdC4f17');
        expect(actual).toStrictEqual([]);
    });

});

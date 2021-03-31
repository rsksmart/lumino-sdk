jest.mock('../src/utils');

import Lumino from '../src';
import config from '../setup'
import { createClient } from '../src/utils';

describe('Networks', () => {
    let lumino;
    let mockAxios;

    beforeEach(() => {
        lumino = new Lumino({ ...config });
        mockAxios = createClient();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should leave all channels using a token', async () => {
        const tokenAddress = '0x47E5b7d85Da2004781FeD64aeEe414eA9CdC4f17';
        const expected = [
            {
              "state": "opened",
              "balance": 1,
              "settle_timeout": 500,
              "total_deposit": 1,
              "channel_identifier": 1,
              "partner_address": "0xb69755ee7da32BF1853cFb77cC353f8A03677AA7",
              "token_address": tokenAddress,
              "token_network_identifier": "0x5a4D929F1b6888B200D7402B334622B3feB04F7a",
              "reveal_timeout": 50
            }
          ]
        mockAxios.delete.mockResolvedValue({ data: expected });
        
        const actual = await lumino.leaveNetwork(tokenAddress);
        
        expect(mockAxios.delete).toHaveBeenCalledTimes(1);
        expect(actual).toBe(expected);
    });

});

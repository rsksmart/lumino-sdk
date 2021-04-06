
jest.mock('../src/utils');

import Lumino from '../src';
import config from '../setup'
import { createClient } from '../src/utils';

describe('Search', () => {
    let lumino;
    let mockAxios;

    beforeEach(() => {
        lumino = new Lumino(config.luminoNodeBaseUrl);
        mockAxios = createClient();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should search', async () => {
        const expected = {
            "results": {
                "token_address_matches": [
                    "0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d"
                ],
                "node_address_matches": [],
                "channel_identifiers_matches": [],
                "rns_address_matches": []
            }
        };
        mockAxios.get.mockResolvedValue({ data: expected });
        const params = {
            query: "0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d"
        }
        const actual = await lumino.search(params);
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(mockAxios.get).toHaveBeenCalledWith('searchLumino', {params})
        expect(actual).toBe(expected);
    });

});

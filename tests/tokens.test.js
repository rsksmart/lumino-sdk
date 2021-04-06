
jest.mock('../src/utils');

import Lumino from '../src';
import config from '../setup'
import { createClient } from '../src/utils';

describe('Tokens', () => {
    let lumino;
    let mockAxios;

    beforeEach(() => {
        lumino = new Lumino(config.luminoNodeBaseUrl);
        mockAxios = createClient();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should get all tokens known by the node', async () => {
        const expected = [
            "0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d"
        ];
        mockAxios.get.mockResolvedValue({ data: expected });
        const actual = await lumino.getTokens();
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(actual).toBe(expected);
    });

});

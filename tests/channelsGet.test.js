/* eslint-env jasmine */

import Lumino from '../src';
import config from '../sdk-config'

let lumino;

beforeEach(async() => {
    lumino = new Lumino({ ...config});
});

test.only('skipping', async () => {});

test('should get active channels', async () => {
    const channels = await lumino.getChannels({ token_addresses: '0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d' });
    console.log(channels)
    expect(Array.isArray(channels)).toEqual(true);
});

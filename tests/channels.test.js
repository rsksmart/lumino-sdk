
jest.mock('../src/utils');

import Lumino from '../src';
import config from '../setup'
import {createClient} from '../src/utils';

describe('channels', () => {
    let lumino;
    let mockAxios;

    beforeEach(() => {
        lumino = new Lumino(config.luminoNodeBaseUrl);
        mockAxios = createClient();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should get all active channels', async () => {
        const expectedChannels = [
            {
                "total_deposit": 1000000000000000000,
                "balance": 1000000000000000000,
                "reveal_timeout": 50,
                "token_address": "0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d",
                "state": "opened",
                "channel_identifier": 3,
                "settle_timeout": 500,
                "partner_address": "0xb26fC60F1427570D3804F33D56e1db31D18d9f1B",
                "token_network_identifier": "0x0057f5F9Ab25De7F39aa7B80195Bd9150C636504"
            },
            {
                "total_deposit": 0,
                "balance": 0,
                "reveal_timeout": 50,
                "token_address": "0x56877CA1B38DcB815962De7C38FD21ef04b44c36",
                "state": "opened",
                "channel_identifier": 4,
                "settle_timeout": 500,
                "partner_address": "0xFDB5188724e7b84733B8ddAd5b27039891C36dCc",
                "token_network_identifier": "0x0057f5F9Ab25De7F39aa7B80195Bd9150C636504"
            }
        ];
        mockAxios.get.mockResolvedValue({ data: expectedChannels });
        const actualChannels = await lumino.getChannels()
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(mockAxios.get).toHaveBeenCalledWith('channels');
        expect(actualChannels).toBe(expectedChannels);
    });

    it('should get active channels by token address', async () => {
        const tokenAddress = '0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d';
        const expectedChannels = [
            {
                "total_deposit": 1000000000000000000,
                "balance": 1000000000000000000,
                "reveal_timeout": 50,
                "token_address": tokenAddress,
                "state": "opened",
                "channel_identifier": 3,
                "settle_timeout": 500,
                "partner_address": "0xb26fC60F1427570D3804F33D56e1db31D18d9f1B",
                "token_network_identifier": "0x0057f5F9Ab25De7F39aa7B80195Bd9150C636504"
            }
        ];

        mockAxios.get.mockResolvedValue({ data: expectedChannels });
        const actualChannels = await lumino.getChannels(tokenAddress)
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(mockAxios.get).toHaveBeenCalledWith(`channels/${tokenAddress}`);
        expect(actualChannels).toBe(expectedChannels);
    });

    it('should get active channel by token and partner address', async () => {
        const tokenAddress = '0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d';
        const partnerAddress  = '0xF355C8BA6692b4651aAF5Eb1AB13521AfEc3E6d8'
        const expectedChannel = {
            "settle_timeout": 500,
            "partner_address": "0xF355C8BA6692b4651aAF5Eb1AB13521AfEc3E6d8",
            "token_address": "0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d",
            "channel_identifier": 6,
            "balance": 1,
            "total_deposit": 1,
            "state": "opened",
            "token_network_identifier": "0x0057f5F9Ab25De7F39aa7B80195Bd9150C636504",
            "reveal_timeout": 50
        };

        mockAxios.get.mockResolvedValue({ data: expectedChannel });
        const actualChannel = await lumino.getChannel({ tokenAddress, partnerAddress });
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(mockAxios.get).toHaveBeenCalledWith(`channels/${tokenAddress}/${partnerAddress}`);
        expect(actualChannel).toBe(expectedChannel);
    });

    it('should open a channel with rsk address', async () => {
        const rskPartnerAddress = '0xFDB5188724e7b84733B8ddAd5b27039891C36dCc'
        const tokenAddress = '0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d';
        const amountOnWei = 0;
        const expected = {
            "reveal_timeout": 50,
            "total_deposit": amountOnWei,
            "token_network_identifier": "0x0057f5F9Ab25De7F39aa7B80195Bd9150C636504",
            "settle_timeout": 500,
            "token_address": tokenAddress,
            "channel_identifier": 5,
            "balance": 0,
            "state": "opened",
            "partner_address": rskPartnerAddress
        };
        mockAxios.put.mockResolvedValue({ data: expected });
        const actual = await lumino.openChannel({ rskPartnerAddress, tokenAddress, amountOnWei });
        expect(mockAxios.put).toHaveBeenCalledTimes(1);
        expect(actual).toBe(expected);
    });

    it('should open a channel with rns address', async () => {
        const rnsPartnerAddress = "test.rsk";
        const rskPartnerAddress = '0xFDB5188724e7b84733B8ddAd5b27039891C36dCc'
        const tokenAddress = '0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d';
        const amountOnWei = 0;
        const expected = {
            "reveal_timeout": 50,
            "total_deposit": amountOnWei,
            "token_network_identifier": "0x0057f5F9Ab25De7F39aa7B80195Bd9150C636504",
            "settle_timeout": 500,
            "token_address": tokenAddress,
            "channel_identifier": 5,
            "balance": 0,
            "state": "opened",
            "partner_address": rskPartnerAddress
        };
        mockAxios.put.mockResolvedValue({ data: expected });
        const actual = await lumino.openChannel({ rnsPartnerAddress, tokenAddress, amountOnWei });
        expect(mockAxios.put).toHaveBeenCalledTimes(1);
        expect(actual).toBe(expected);
    });

    it('should not open a channel when rns and rsk address are both present', (done) => {
        const params = {
            rnsPartnerAddress: "test.rsk",
            rskPartnerAddress: '0xFDB5188724e7b84733B8ddAd5b27039891C36dCc',
            tokenAddress: '0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d',
            amountOnWei: 0
        };
        lumino.openChannel(params)
            .then(() => done.fail())
            .catch(() => done());
    });

    it('should not open a channel when rns and rsk address are not present', (done) => {
        const params = {
            tokenAddress: '0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d',
            amountOnWei: 0
        };
        lumino.openChannel(params)
            .then(() => done.fail())
            .catch(() => done());
    });

    it('should close a channel', async () => {
        const expected = {
            "reveal_timeout": 50,
            "total_deposit": 2000000000000000000,
            "token_network_identifier": "0x0057f5F9Ab25De7F39aa7B80195Bd9150C636504",
            "settle_timeout": 500,
            "token_address": "0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d",
            "channel_identifier": 4,
            "balance": 2000000000000000000,
            "state": "closed",
            "partner_address": "0xFDB5188724e7b84733B8ddAd5b27039891C36dCc"
        };
        mockAxios.patch.mockResolvedValue({ data: expected});
        const params = {
            tokenAddress: '0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d',
            partnerAddress: '0xFDB5188724e7b84733B8ddAd5b27039891C36dCc'
        };
        const actual = await lumino.closeChannel(params)
        expect(mockAxios.patch).toBeCalledTimes(1);
        expect(actual).toBe(expected);
    });

    it('should deposit tokens', async () => {
        const channel = {
            "settle_timeout": 500,
            "partner_address": "0xF355C8BA6692b4651aAF5Eb1AB13521AfEc3E6d8",
            "token_address": "0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d",
            "channel_identifier": 6,
            "balance": 1,
            "total_deposit": 1,
            "state": "opened",
            "token_network_identifier": "0x0057f5F9Ab25De7F39aa7B80195Bd9150C636504",
            "reveal_timeout": 50
        };
        mockAxios.get.mockResolvedValue({ data: channel});
        const expected = {
            "reveal_timeout": 50,
            "total_deposit": 1,
            "token_network_identifier": "0x0057f5F9Ab25De7F39aa7B80195Bd9150C636504",
            "settle_timeout": 500,
            "token_address": "0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d",
            "channel_identifier": 6,
            "balance": 1,
            "state": "opened",
            "partner_address": "0xF355C8BA6692b4651aAF5Eb1AB13521AfEc3E6d8"
        };

        mockAxios.patch.mockResolvedValue({ data: expected});
        const params = {
            tokenAddress: '0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d',
            partnerAddress: '0xF355C8BA6692b4651aAF5Eb1AB13521AfEc3E6d8',
            amountOnWei: expected.total_deposit
        };
        const actual = await lumino.depositTokens(params);
        expect(mockAxios.get).toBeCalledTimes(1);
        expect(mockAxios.patch).toBeCalledTimes(1);
        expect(actual).toBe(expected);
    });
});

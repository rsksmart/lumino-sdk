
jest.mock('../src/utils');

import Lumino from '../src';
import config from '../setup'
import {createClient} from '../src/utils';

describe('channels', () => {
    let lumino;
    let mockAxios;

    beforeEach(() => {
        lumino = new Lumino({ ...config });
        mockAxios = createClient();
    });

    it('should get all active channels', (done) => {
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
        lumino.getChannels().subscribe(actualChannels => {
            expect(mockAxios.get).toHaveBeenCalledTimes(1);
            expect(mockAxios.get).toHaveBeenCalledWith('channels');
            expect(actualChannels).toBe(expectedChannels);
            done();
        }, () => done.fail());
    });


    it('should get active channels by token address', (done) => {
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
        lumino.getChannels(tokenAddress).subscribe(actualChannels => {
            expect(mockAxios.get).toHaveBeenCalledTimes(1);
            expect(mockAxios.get).toHaveBeenCalledWith(`channels/${tokenAddress}`);
            expect(actualChannels).toBe(expectedChannels);
            done();
        }, () => done.fail());
    });

    it('should open a channel with rsk address', (done) => {
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
        lumino.openChannel({ rskPartnerAddress, tokenAddress, amountOnWei })
            .subscribe(actual => {
                expect(mockAxios.put).toHaveBeenCalledTimes(1);
                expect(actual).toBe(expected);
                done();
            }, () => done.fail());
    });

    it('should open a channel with rns address', (done) => {
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
        lumino.openChannel({ rnsPartnerAddress, tokenAddress, amountOnWei })
            .subscribe(actual => {
                expect(mockAxios.put).toHaveBeenCalledTimes(1);
                expect(actual).toBe(expected);
                done();
            });
    });

    it('should not open a channel when rns and rsk address are both present', (done) => {
        const params = {
            rnsPartnerAddress: "test.rsk",
            rskPartnerAddress: '0xFDB5188724e7b84733B8ddAd5b27039891C36dCc',
            tokenAddress: '0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d',
            amountOnWei: 0
        };
        lumino.openChannel(params).subscribe(() => done.fail(), () => done());
    });

    it('should not open a channel when rns and rsk address are not present', (done) => {
        const params = {
            tokenAddress: '0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d',
            amountOnWei: 0
        };
        lumino.openChannel(params).subscribe(() => done.fail(), () => done());
    });

    it('should close a channel', (done) => {
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
        lumino.closeChannel(params).subscribe((actual) => {
            expect(mockAxios.patch).toBeCalledTimes(1);
            expect(actual).toBe(expected);
            done();
        }, () => done.fail());
    });

    it('should deposit tokens', (done) => {
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
        lumino.depositTokens(params).subscribe((actual) => {
            expect(mockAxios.patch).toBeCalledTimes(1);
            expect(actual).toBe(expected);
            done();
        }, () => done.fail());
    });
});

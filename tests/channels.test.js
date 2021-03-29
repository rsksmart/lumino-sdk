
jest.mock('../src/utils');

import Lumino from '../src';
import config from '../sdk-config'
import {createClient} from '../src/utils';

describe('channels', () => {
    let lumino;
    let mockAxios;
    const data = [
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
    
    beforeEach(() => {
        lumino = new Lumino({ ...config});
        mockAxios = createClient();
    });
    
    it('should get all active channels', (done) => {
        const expectedChannels = data;
        mockAxios.get.mockResolvedValue({ data: expectedChannels });
        lumino.getChannels().subscribe(actualChannels => {
            expect(mockAxios.get).toHaveBeenCalledTimes(1);
            expect(mockAxios.get).toHaveBeenCalledWith('channels');
            expect(actualChannels).toBe(expectedChannels);
            done();
        });
    });


    it('should get active channels by token address', (done) => {
        const expectedChannel = data[0];
        const expectedChannels = data.filter(channel => channel.token_address === expectedChannel.token_address);
        
        mockAxios.get.mockResolvedValue({ data: expectedChannels });
        lumino.getChannels(expectedChannel.token_address).subscribe(actualChannels => {
            expect(mockAxios.get).toHaveBeenCalledTimes(1);
            expect(mockAxios.get).toHaveBeenCalledWith(`channels/${expectedChannel.token_address}`);
            expect(actualChannels).toBe(expectedChannels);
            done();
        });
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
        });
    });

    it('should open a channel with rns address', () => {
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
    
});
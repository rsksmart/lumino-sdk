
jest.mock('../src/utils');

import Lumino from '../src';
import config from '../setup'
import { createClient } from '../src/utils';

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
            {
                "log_time": "2021-03-30T12:54:32.179",
                "target": "0xb26fC60F1427570D3804F33D56e1db31D18d9f1B",
                "amount": 1000000000000000000,
                "token_address": "0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d",
                "identifier": 12027048240280050836,
                "event": "EventPaymentSentSuccess",
                "token_network_identifier": "0x0057f5F9Ab25De7F39aa7B80195Bd9150C636504"
            },
            {
                "log_time": "2021-03-30T12:54:58.408",
                "amount": 1000000000000000000,
                "initiator": "0xb26fC60F1427570D3804F33D56e1db31D18d9f1B",
                "token_address": "0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d",
                "identifier": 16539674293179924293,
                "event": "EventPaymentReceivedSuccess",
                "token_network_identifier": "0x0057f5F9Ab25De7F39aa7B80195Bd9150C636504"
            }
        ];
        mockAxios.get.mockResolvedValue({ data: expected });
        const actual = await lumino.getPayments();
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(actual).toBe(expected);
    });

    it('should make a payment', async () => {
        const expected = {
            "target_address": "0xb26fC60F1427570D3804F33D56e1db31D18d9f1B",
            "amount": 1000000000000000000,
            "token_address": "0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d",
            "secret": "0xe3df269359aad85b1b73772505770ab109c33b2ab2fa65f9a4eb61f925262c29",
            "identifier": 1013662278008760351,
            "secret_hash": "0xafce2de245b9ea8f594a5c12625abdcb9e01ca52168dafd4ff658909f48c981b",
            "initiator_address": "0x2Cd53d83E5ca1F3c66EDC7bf307139c6B1989C9a"
        }
        mockAxios.post.mockResolvedValue({ data: expected });
        const params = {
            amountOnWei: 1000000000000000000,
            tokenAddress: "0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d",
            partnerAddress: "0xb26fC60F1427570D3804F33D56e1db31D18d9f1B"
        }
        const actual = await lumino.makePayment(params);
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
        expect(actual).toBe(expected);
    });


});

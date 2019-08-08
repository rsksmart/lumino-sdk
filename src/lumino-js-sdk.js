import 'babel-polyfill';

import APICall from './restClient/APICall';
import Util from './utils/Util';
import BlockChainService from './services/BlockChainService';

/**
 * @classdesc Represents the Lumino SDK. It allows the user to make every call to the API with a single function.
 * @class
 */
export default class Lumino {

    /**
     * Create Lumino SDK.
     * @constructor
     * @param {String} options.luminoNodeBaseUrl - The base URL to invoke the api of node.
     * @param {String} options.debug - Flag to see requests and responses when call an api node.
     * @param {String} options.rskRpcNodeBaseUrl - The base URL to invoke a RSK blockchain.
     * @param {String} options.nodeLuminoAddress - Principal node address.
     */
    constructor(options) {
        this.options = options;
        this.debug = false;
        if (options.debug){
            this.debug = options.debug;
        }
        this.luminoNodeBaseUrl = options.luminoNodeBaseUrl;
        this.rskRpcNodeBaseUrl = options.rskRpcNodeBaseUrl;
        this.nodeLuminoAddress = options.nodeLuminoAddress;
        this.blockChainService = new BlockChainService();
        this.util = new Util();

        this.api = new APICall(
            this.luminoNodeBaseUrl,
            this.debug
        );
    }

    /**
     * Get payments with combination of parameters.
     *
     * @param params - Are not mandatory. Exists a set of parameter what you can use to get payments.
     * This params are:
     *  - limit: to limit de quantity of payments
     *  - offset: to navigate between pages
     *  - initiator_address: to get payments with event EventPaymentSentSuccess, for the current node.
     *  - target_address: to get payments with target is equal to target_address param and the result can include,
     *    events how Sent, Received, Failed or Pending.
     *  - token_network_identifier: if you can obtain a set of payments in specific token_network
     *  - event_type: You can get 3 different types of events. This events correspond the following names;
     *    EventPaymentReceivedSuccess, EventPaymentSentFailed, EventPaymentSentSuccess. This names corresponding
     *    a differents ids with you can put into params. EventPaymentReceivedSuccess correspond to 1, EventPaymentSentFailed
     *    to 2 and EventPaymentSentSuccess correspond to 3.
     *  - from_date: Specific from_date to get payments.
     *  - to_date: Specific to_date to get payments.
     *
     *  The format of dates in params follow the standar ISO 8601 in UTC. For example: 2019-04-11T00:00:00Z
     *  All of this params are optonally, and can use in combination with others.
     *  Limit and offset params they must be used togheter, or only limit.
     *
     * @return {Promise} Payments - Returns a Promise that, when fulfilled, will either return an Array with the
     * payments or an Error with the problem.
     */
    getPayments(params = {}) {
        return this.api.send('GET', 'paymentsLumino', null, params);
    }

    /**
     * Get channels
     *
     * @param params {Map} :  Is mandatory put a token address to get channels
     * @param params.token_addresses {String} : list of token addresses separated by commas
     *
     * @return {Promise} Channels - Returns a Promise that, when fulfilled, will either return an Array with the
     * channels or an Error with the problem. The channels obtained are only open.
     */
    getChannels(params = {}) {
        return this.api.send('GET', 'channelsLumino', null , params);
    }

    /**
     * Get tokens
     *
     * This function makes two calls, the first invocation is to lumino node api, this call get a list of token
     * addresses, the second call is for a blocakain, and this gets a detail of each token in a list.
     *
     * @returns {Promise} Tokens - Returns a Promise that, when fulfilled, will either return an Array with the
     * tokens details or an Error with the problem. The channels obtained are only open.
     */
    async getTokens() {

        const tokenListAddresses = await this.api.send('GET', 'tokens');
        const tokenListDetails = await this.blockChainService.retrieveTokensData(this.rskRpcNodeBaseUrl, this.nodeLuminoAddress, tokenListAddresses);
        return tokenListDetails;
    }

    /**
     * Search tokens, channels, nodes and rns addresses.
     *
     * @param params - query param is mandatory
     * @returns {Promise} Tokens - Returns a Promise that, when fulfilled, will either return an Map with the
     * result search or an Error with the problem. The search result can get contain token addresses matches, node
     * address matches, channel identifier matches and rns address matches.
     */
    search(params = {}) {
        return this.api.send('GET', 'searchLumino', null, params);
    }

    /**
     * Open a new offchain channel between two nodes. Allow open a new channel by rsk address node or
     * rns address node.
     *
     * @param body - This is mandatory
     *  - rskPartnerAddress - for example: 0x3E5B85E29504522DCD923aa503b4C502A64AdB7C
     *  - rnsPartnerAddress - for example: dev.rsk.co
     *  - tokenAddress - for example: 0x714E99c00D4Abf4a8a2Af90Fd40B595C68801C42
     *  - amount - for example: 1 - This amount after is converted in wei unit
     *
     *  The params rnsPartnerAddress and rnsPartnerAddress never go together
     *
     * @returns {Promise} new channel info, or and error information
     */
    async openChannel(data = {}) {
        let urlPath = 'channels';
        let body = {}

        const tokens = await this.getTokens();
        const tokenDecimals = this.util.getDecimals(data.tokenAddress, tokens);

        body.total_deposit = this.util.toWei(data.amount, tokenDecimals);
        if (data.rskPartnerAddress) {
            body.partner_address = data.rskPartnerAddress;
        } else if (data.rnsPartnerAddress) {
            urlPath = "channelsLumino";
            body.partner_rns_address = data.rnsPartnerAddress;
        }

        body.token_address = data.tokenAddress;
        body.settle_timeout = 500;

        const openChannelResponse = await this.api.send('PUT', urlPath, body, null);
        return openChannelResponse;

    }

    /**
     * Close an exist channel between two nodes.
     *
     * @param data {Map} - This is mandatory
     * @param data.state {String} - The value of this params must be closed
     * @param params {Map} - This is mandatory
     * @param params.partnerAddress {String} - For example: 0x3E5B85E29504522DCD923aa503b4C502A64AdB7C
     * @param params.tokenAddress {String} - For example: 0x714E99c00D4Abf4a8a2Af90Fd40B595C68801C42
     * @returns {Promise} close channel response, or error response.
     */
    closeChannel(data = {}, params = {}) {
        let url = 'channels/' + params.tokenAddress + "/" + params.partnerAddress;
        return this.api.send('PATCH', url, data, params);
    }


    /**
     * Make offchain payment in a channel created between two nodes.
     *
     * @param data {Map} - Mandatory
     * @param data.amount {number} - Mandatory
     * @param params {Map} - Mandatory
     * @param params.tokenAddress {String} - Mandatory
     * @param params.partnerAddress {String} - Mandatory
     *
     * @returns {Promise}
     */
    async makePayment(data = {}, params = {}) {
        let body = {};
        const tokens = await this.getTokens();
        const url = 'payments/' + params.tokenAddress + "/" + params.partnerAddress;

        const tokenDecimals = this.util.getDecimals(params.tokenAddress, tokens);
        body.amount = this.util.toWei(data.amount, tokenDecimals);

        const makePaymentResponse = await this.api.send('POST', url, body, params);

        return makePaymentResponse;
    }

    /**
     * Deposit tokens into a channel between two nodes
     *
     * @param data - Mandatory
     * @param data.amount {Number}
     * @param params - Mandatory
     * @param params.tokenAddress {String}
     * @param params.partnerAddress {String}
     *
     *
     * @returns {Promise} deposit result or error
     */
    async depositTokens(data = {}, params = {}) {
        let body = {};
        const tokens = await this.getTokens();
        const channels = await this.getChannels({'token_addresses': params.tokenAddress});
        const url = 'channels/' + params.tokenAddress + "/" + params.partnerAddress;

        const tokenDecimals = this.util.getDecimals(params.tokenAddress, tokens);
        let channelBalance = 0;

        channels.forEach((tokenChannelMap) => {
            if (tokenChannelMap.token_address === params.tokenAddress) {
                tokenChannelMap.channels.forEach((channel) => {
                    if (channel.state === 'opened' && channel.partner_address === params.partnerAddress){
                        channelBalance = channel.total_deposit;
                    }
                });
            }
        });

        body.total_deposit = Number(this.util.toWei(data.amount, tokenDecimals)) + Number(channelBalance);

        const depositTokensResponse = await this.api.send('PATCH', url, body, params);

        return depositTokensResponse;
    }

    /**
     * Join into a network creating a new channels with specific token with each node of the
     * network
     * @param data - Mandatory
     * @param params
     * @returns {Promise}
     */
    async joinNetwork(data = {}, params = {}) {
        let body = {};
        const tokens = await this.getTokens();
        const url = 'connections/' + params.tokenAddress;
        const tokenDecimals = this.util.getDecimals(params.tokenAddress, tokens);

        body.funds = Number(this.util.toWei(data.funds, tokenDecimals));

        const joinNetworkResponse = await this.api.send('PUT', url, body, params);

        return joinNetworkResponse;
    }

    /**
     *  Leave network for specific token
     *
     * @param params - Mandatory
     * @param params.tokenAddress
     *
     * @returns {Promise}
     */
    leaveNetwork(params = {}) {
        const url = 'connections/' + params.tokenAddress;
        return this.api.send('DELETE', url, body);
    }
}


import createClient from './api';
import web3 from 'web3';

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
    // TODO: do we really need the other params?
    this.options = options;
    this.debug = false;
    if (options.debug) {
      this.debug = options.debug;
    }
    this.luminoNodeBaseUrl = options.luminoNodeBaseUrl;
    this.rskRpcNodeBaseUrl = options.rskRpcNodeBaseUrl;
    this.nodeLuminoAddress = options.nodeLuminoAddress;
    this.api = createClient({
      luminoNodeBaseUrl: this.luminoNodeBaseUrl,
      debug: this.debug,
    });
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
   *    a different ids with you can put into params. EventPaymentReceivedSuccess correspond to 1, EventPaymentSentFailed
   *    to 2 and EventPaymentSentSuccess correspond to 3.
   *  - from_date: Specific from_date to get payments.
   *  - to_date: Specific to_date to get payments.
   *
   *  The format of dates in params follow the ISO 8601 in UTC. For example: 2019-04-11T00:00:00Z
   *  All of this params are optional, and can use in combination with others.
   *  Limit and offset params they must be used together, or only limit.
   *
   * @return {Promise} Payments - Returns a Promise that, when fulfilled, will either return an Array with the
   * payments or an Error with the problem.
   */
  getPayments(params = {}) {
    return this.api.get('paymentsLumino', { params });
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
  async getChannels(params = {}) {
    const { data } = await this.api.get('channelsLumino', { params });
    return data;
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
    return this.api.get('searchLumino', { params });
  }

  /**
   * Open a new offchain channel between two nodes. Allow open a new channel by rsk address node or
   * rns address node.
   *
   * @param data - This is mandatory
   *  - rskPartnerAddress - for example: 0x3E5B85E29504522DCD923aa503b4C502A64AdB7C
   *  - rnsPartnerAddress - for example: dev.rsk.co
   *  - tokenAddress - for example: 0x714E99c00D4Abf4a8a2Af90Fd40B595C68801C42
   *  - amount - for example: 1 - This amount after is converted in wei unit
   *
   *  The params rnsPartnerAddress and rnsPartnerAddress never go together
   *
   * @returns {Promise} new channel info, or and error information
   */
  openChannel(data = {}) {
    const body = {
      token_address: data.tokenAddress,
      settle_timeout: 500,
      total_deposit: web3.utils.toWei(data.amount).toNumber(),
    };
    if (data.rskPartnerAddress) {
      body.partner_address = data.rskPartnerAddress;
      return this.api.put('channels', body);
    }
    if (data.rnsPartnerAddress) {
      body.partner_rns_address = data.rnsPartnerAddress;
      return this.api.put('channelsLumino', body);
    }
  }

  /**
   * Close an exist channel between two nodes.
   *
   * @param params {Map} - This is mandatory
   * @param params.partnerAddress {String} - For example: 0x3E5B85E29504522DCD923aa503b4C502A64AdB7C
   * @param params.tokenAddress {String} - For example: 0x714E99c00D4Abf4a8a2Af90Fd40B595C68801C42
   * @returns {Promise} close channel response, or error response.
   */
  closeChannel({ tokenAddress, partnerAddress }) {
    return this.api.patch(
      `channels/${tokenAddress}/${partnerAddress}`,
      { state: 'closed' },
      {
        params: { tokenAddress, partnerAddress },
      }
    );
  }

  /**
   * Make offchain payment in a channel created between two nodes.
   *
   * @param params {Map} - Mandatory
   * @param params.amount {number} - Mandatory
   * @param params.tokenAddress {String} - Mandatory
   * @param params.partnerAddress {String} - Mandatory
   *
   * @returns {Promise}
   */
  async makePayment({ amount, tokenAddress, partnerAddress }) {
    let body = { amount: web3.utils.toWei(amount) };
    return await this.api.send(
      'POST',
      `payments/${tokenAddress}/${partnerAddress}`,
      body
    );
  }

  /**
   * Deposit tokens into a channel between two nodes
   *
   * @param params {Map} - Mandatory
   * @param params.amount {number} - Mandatory
   * @param params.tokenAddress {String} - Mandatory
   * @param params.partnerAddress {String} - Mandatory
   *
   *
   * @returns {Promise} deposit result or error
   */
  async depositTokens({ amount, tokenAddress, partnerAddress }) {
    const channels = await this.getChannels({ token_addresses: tokenAddress });
    channels.forEach(tokenChannelMap => {
      if (tokenChannelMap.token_address === tokenAddress) {
        tokenChannelMap.channels.forEach(channel => {
          if (
            channel.state === 'opened' &&
            channel.partner_address === partnerAddress
          ) {
            const total_deposit =
              Number(web3.utils.toWei(amount)) + Number(channel.total_deposit);
            return this.api.patch(
              `channels/${tokenAddress}/${partnerAddress}`,
              { total_deposit },
              { params: { tokenAddress, partnerAddress } }
            );
          }
        });
      }
    });
    throw new Error('Channel not found');
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
    const url = 'connections/' + params.tokenAddress;
    body.funds = Number(web3.utils.toWei(data.funds));
    return await this.api.send('PUT', url, body, params);
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
    return this.api.send('DELETE', url);
  }
}

import { createClient, handleResponse } from './utils';

/**
 * @classdesc Represents the Lumino SDK. It allows the user to make every call to the API with a single function.
 * @class
 */
export default class Lumino {
  /**
   * Create Lumino SDK.
   * @constructor
   * @param {String} luminoNodeBaseUrl - The base URL to invoke the api of node.
   * @param {String} debug - Flag to see requests and responses when call an api node.
   * @param {String} nodeLuminoAddress - Principal node address.
   */
  constructor({ debug, luminoNodeBaseUrl }) {
    this.debug = !!debug;
    this.client = createClient(luminoNodeBaseUrl);
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
   *
   * @example
   *    getPayments({
   *         token_network_identifier: string,
   *         initiator_address: String,
   *         target_address: String,
   *         from_date: String,
   *         to_date: String,
   *         event_type: Integer,
   *         limit: Integer,
   *         offset: Integer,
   *    })
   *
   */
  getPayments(params) {
    return handleResponse(this.client.get('paymentsLumino', { params }));
  }

  /**
   * Get Joinable channels by token address
   *
   * @param tokenAddresses {String} : list of token addresses separated by commas
   *
   * @return {Promise} Channels - Returns a Observable that, when fulfilled, will either return an Array with the
   * channels or an Error with the problem. The channels obtained are only open.
   */
  getJoinableChannels(tokenAddresses) {
    return handleResponse(
      this.client.get('channelsLumino', {
        params: { token_addresses: tokenAddresses },
      })
    );
  }

  /**
   * Get channels
   *
   * @param tokenAddress {String} : an optional tokenAddress to filter by.
   *
   * @return {Promise} Channels - Returns a Observable that, when fulfilled, will either return an Array with the
   * channels or an Error with the problem. The channels obtained are only open.
   */
  getChannels(tokenAddress = null) {
    if (tokenAddress) {
      return handleResponse(this.client.get(`channels/${tokenAddress}`));
    }
    return handleResponse(this.client.get('channels'));
  }

  /**
   * Get channel
   *
   * @param tokenAddress {String} : the mandatory channel token_address.
   * @param partnerAddress {String} : the mandatory channel partner_address.
   *
   * @return {Promise} Channels - Returns a Observable that, when fulfilled, will either return an Array with the
   * channels or an Error with the problem. The channels obtained are only open.
   */
  getChannel({ tokenAddress, partnerAddress }) {
    return handleResponse(
      this.client.get(`channels/${tokenAddress}/${partnerAddress}`)
    );
  }

  /**
   * Search tokens, channels, nodes and rns addresses.
   *
   * @param query - query it's an string that should contain an address or addresses
   *                (from nodes, channels, rns addresses or tokens) to be search by lumino.
   * @param onlyReceivers - only search by using node addresses
   *
   * @returns {Promise} Tokens - Returns a Promise that, when fulfilled, will either return an Map with the
   * result search or an Error with the problem. The search result can get contain token addresses matches, node
   * address matches, channel identifier matches and rns address matches.
   */
  search({ query, onlyReceivers }) {
    return handleResponse(
      this.client.get('searchLumino', {
        params: { query: query, only_receivers: onlyReceivers },
      })
    );
  }

  /**
   * Open a new channel between two nodes. Allow open a new channel by rsk address node or
   * rns address node.
   *
   * @param params - This is mandatory
   *  - rskPartnerAddress - for example: 0x3E5B85E29504522DCD923aa503b4C502A64AdB7C
   *  - rnsPartnerAddress - for example: dev.rsk.co
   *  - tokenAddress - for example: 0x714E99c00D4Abf4a8a2Af90Fd40B595C68801C42
   *  - amountOnWei - for example: 1, should be on wei
   *
   *  The params rnsPartnerAddress and rnsPartnerAddress never go together
   *
   * @returns {Promise} new channel info, or and error information
   */
  openChannel({
    tokenAddress,
    amountOnWei,
    rskPartnerAddress,
    rnsPartnerAddress,
  }) {
    const body = {
      token_address: tokenAddress,
      settle_timeout: 500,
      total_deposit: amountOnWei,
    };
    if (rskPartnerAddress && rnsPartnerAddress) {
      return handleResponse(
        Promise.reject(
          'The params rnsPartnerAddress and rnsPartnerAddress never go together'
        )
      );
    }
    if (rskPartnerAddress) {
      body.partner_address = rskPartnerAddress;
      return handleResponse(this.client.put('channels', body));
    }
    if (rnsPartnerAddress) {
      body.partner_rns_address = rnsPartnerAddress;
      return handleResponse(this.client.put('channelsLumino', body));
    }
    return handleResponse(
      Promise.reject(
        'You need to specify partner_address or rnsPartnerAddress parameters'
      )
    );
  }

  /**
   * Close an exist channel.
   *
   * @param partnerAddress {String} - For example: 0x3E5B85E29504522DCD923aa503b4C502A64AdB7C
   * @param tokenAddress {String} - For example: 0x714E99c00D4Abf4a8a2Af90Fd40B595C68801C42
   * @returns {Promise} close channel response, or error response.
   */
  closeChannel({ tokenAddress, partnerAddress }) {
    return handleResponse(
      this.client.patch(
        `channels/${tokenAddress}/${partnerAddress}`,
        { state: 'closed' },
        {
          params: {
            token_address: tokenAddress,
            partner_address: partnerAddress,
          },
        }
      )
    );
  }

  /**
   * Make off chain payment in a channel.
   *
   * @param amountOnWei {number} - Mandatory, the amount has to be on wei
   * @param tokenAddress {String} - Mandatory
   * @param partnerAddress {String} - Mandatory
   *
   * @returns {Promise}
   */
  makePayment({ amountOnWei, tokenAddress, partnerAddress }) {
    return handleResponse(
      this.client.post(`payments/${tokenAddress}/${partnerAddress}`, {
        amount: amountOnWei,
      })
    );
  }

  /**
   * Deposit tokens into a channel
   *
   * @param amountOnWei {number} - Mandatory should be on wei
   * @param tokenAddress {String} - Mandatory
   * @param partnerAddress {String} - Mandatory
   *
   * @returns {Promise} deposit result or error
   */
  depositTokens({ amountOnWei, tokenAddress, partnerAddress }) {
    return this.getChannel({ tokenAddress, partnerAddress }).then(channel => {
      const total_deposit = Number(amountOnWei) + Number(channel.total_deposit);
      return handleResponse(
        this.client.patch(
          `/api/v1/channels/${tokenAddress}/${partnerAddress}`,
          { total_deposit }
        )
      );
    });
  }

  /**
   * Join into a network creating a new channels with specific token with each node of the
   * network
   */
  joinNetwork() {
    // let body = {};
    // const url = 'connections/' + params.tokenAddress;
    // body.funds = Number(web3.utils.toWei(data.funds));
    // return await this.client.send('PUT', url, body, params);
    return Promise.reject('Not implemented');
  }

  /**
   *  Leave network for specific token
   *
   * @param tokenAddress
   *
   * @returns {Promise}
   */
  leaveNetwork(tokenAddress) {
    return handleResponse(
      //TODO: fix, lumino node stop working here when you send an unknown token address.
      this.client.delete(`connections/${tokenAddress}`)
    );
  }
}

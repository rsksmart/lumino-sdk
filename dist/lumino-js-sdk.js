'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('babel-polyfill');

var _APICall = require('./restClient/APICall');

var _APICall2 = _interopRequireDefault(_APICall);

var _Util = require('./utils/Util');

var _Util2 = _interopRequireDefault(_Util);

var _BlockChainService = require('./services/BlockChainService');

var _BlockChainService2 = _interopRequireDefault(_BlockChainService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @classdesc Represents the Lumino SDK. It allows the user to make every call to the API with a single function.
 * @class
 */
var Lumino = function () {

    /**
     * Create Lumino SDK.
     * @constructor
     * @param {String} options.luminoNodeBaseUrl - The base URL to invoke the api of node.
     * @param {String} options.debug - Flag to see requests and responses when call an api node.
     * @param {String} options.rskRpcNodeBaseUrl - The base URL to invoke a RSK blockchain.
     * @param {String} options.nodeLuminoAddress - Principal node address.
     */
    function Lumino(options) {
        _classCallCheck(this, Lumino);

        this.options = options;
        this.debug = false;
        if (options.debug) {
            this.debug = options.debug;
        }
        this.luminoNodeBaseUrl = options.luminoNodeBaseUrl;
        this.rskRpcNodeBaseUrl = options.rskRpcNodeBaseUrl;
        this.nodeLuminoAddress = options.nodeLuminoAddress;
        this.blockChainService = new _BlockChainService2.default();
        this.util = new _Util2.default();

        this.api = new _APICall2.default(this.luminoNodeBaseUrl, this.debug);
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


    _createClass(Lumino, [{
        key: 'getPayments',
        value: function getPayments() {
            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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

    }, {
        key: 'getChannels',
        value: function getChannels() {
            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            return this.api.send('GET', 'channelsLumino', null, params);
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

    }, {
        key: 'getTokens',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var tokenListAddresses, tokenListDetails;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.api.send('GET', 'tokens');

                            case 2:
                                tokenListAddresses = _context.sent;
                                _context.next = 5;
                                return this.blockChainService.retrieveTokensData(this.rskRpcNodeBaseUrl, this.nodeLuminoAddress, tokenListAddresses);

                            case 5:
                                tokenListDetails = _context.sent;
                                return _context.abrupt('return', tokenListDetails);

                            case 7:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getTokens() {
                return _ref.apply(this, arguments);
            }

            return getTokens;
        }()

        /**
         * Search tokens, channels, nodes and rns addresses.
         *
         * @param params - query param is mandatory
         * @returns {Promise} Tokens - Returns a Promise that, when fulfilled, will either return an Map with the
         * result search or an Error with the problem. The search result can get contain token addresses matches, node
         * address matches, channel identifier matches and rns address matches.
         */

    }, {
        key: 'search',
        value: function search() {
            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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

    }, {
        key: 'openChannel',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var urlPath, body, tokens, tokenDecimals, openChannelResponse;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                urlPath = 'channels';
                                body = {};
                                _context2.next = 4;
                                return this.getTokens();

                            case 4:
                                tokens = _context2.sent;
                                tokenDecimals = this.util.getDecimals(data.tokenAddress, tokens);


                                body.total_deposit = this.util.toWei(data.amount, tokenDecimals);
                                if (data.rskPartnerAddress) {
                                    body.partner_address = data.rskPartnerAddress;
                                } else if (data.rnsPartnerAddress) {
                                    urlPath = "channelsLumino";
                                    body.partner_rns_address = data.rnsPartnerAddress;
                                }

                                body.token_address = data.tokenAddress;
                                body.settle_timeout = 500;

                                _context2.next = 12;
                                return this.api.send('PUT', urlPath, body, null);

                            case 12:
                                openChannelResponse = _context2.sent;
                                return _context2.abrupt('return', openChannelResponse);

                            case 14:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function openChannel() {
                return _ref2.apply(this, arguments);
            }

            return openChannel;
        }()

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

    }, {
        key: 'closeChannel',
        value: function closeChannel() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var url = 'channels/' + params.tokenAddress + "/" + params.partnerAddress;
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

    }, {
        key: 'makePayment',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var body, tokens, url, tokenDecimals, makePaymentResponse;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                body = {};
                                _context3.next = 3;
                                return this.getTokens();

                            case 3:
                                tokens = _context3.sent;
                                url = 'payments/' + params.tokenAddress + "/" + params.partnerAddress;
                                tokenDecimals = this.util.getDecimals(params.tokenAddress, tokens);

                                body.amount = this.util.toWei(data.amount, tokenDecimals);

                                _context3.next = 9;
                                return this.api.send('POST', url, body, params);

                            case 9:
                                makePaymentResponse = _context3.sent;
                                return _context3.abrupt('return', makePaymentResponse);

                            case 11:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function makePayment() {
                return _ref3.apply(this, arguments);
            }

            return makePayment;
        }()

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

    }, {
        key: 'depositTokens',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var body, tokens, channels, url, tokenDecimals, channelBalance, depositTokensResponse;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                body = {};
                                _context4.next = 3;
                                return this.getTokens();

                            case 3:
                                tokens = _context4.sent;
                                _context4.next = 6;
                                return this.getChannels({ 'token_addresses': params.tokenAddress });

                            case 6:
                                channels = _context4.sent;
                                url = 'channels/' + params.tokenAddress + "/" + params.partnerAddress;
                                tokenDecimals = this.util.getDecimals(params.tokenAddress, tokens);
                                channelBalance = 0;


                                channels.forEach(function (tokenChannelMap) {
                                    if (tokenChannelMap.token_address === params.tokenAddress) {
                                        tokenChannelMap.channels.forEach(function (channel) {
                                            if (channel.state === 'opened' && channel.partner_address === params.partnerAddress) {
                                                channelBalance = channel.total_deposit;
                                            }
                                        });
                                    }
                                });

                                body.total_deposit = Number(this.util.toWei(data.amount, tokenDecimals)) + Number(channelBalance);

                                _context4.next = 14;
                                return this.api.send('PATCH', url, body, params);

                            case 14:
                                depositTokensResponse = _context4.sent;
                                return _context4.abrupt('return', depositTokensResponse);

                            case 16:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function depositTokens() {
                return _ref4.apply(this, arguments);
            }

            return depositTokens;
        }()

        /**
         *
         * @param data
         * @param params
         * @returns {Promise<void>}
         */

    }, {
        key: 'joinNetwork',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var body, tokens, url, tokenDecimals, joinNetworkResponse;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                body = {};
                                _context5.next = 3;
                                return this.getTokens();

                            case 3:
                                tokens = _context5.sent;
                                url = 'connections/' + params.tokenAddress;
                                tokenDecimals = this.util.getDecimals(params.tokenAddress, tokens);


                                body.funds = Number(this.util.toWei(data.funds, tokenDecimals));

                                _context5.next = 9;
                                return this.api.send('PUT', url, body, params);

                            case 9:
                                joinNetworkResponse = _context5.sent;
                                return _context5.abrupt('return', joinNetworkResponse);

                            case 11:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function joinNetwork() {
                return _ref5.apply(this, arguments);
            }

            return joinNetwork;
        }()
    }]);

    return Lumino;
}();

exports.default = Lumino;
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

var _ERC20StandardAbi = require('../models/abi/ERC20StandardAbi');

var _ERC20Token = require('../models/ERC20Token');

var _ERC20Token2 = _interopRequireDefault(_ERC20Token);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @classdesc Represents an BlockChainService.
 * @class
 * @abstract
 */
var BlockChainService = function () {
    function BlockChainService() {
        _classCallCheck(this, BlockChainService);
    }

    _createClass(BlockChainService, [{
        key: 'retrieveTokensData',


        /**
         * This method is for get data from RSK blockchain, when token addresses list is provided.
         *
         * @param rskRpcEndpoint
         * @param nodeLuminoAddress
         * @param tokenAddressses
         * @returns {Promise<Array>}
         */
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(rskRpcEndpoint, nodeLuminoAddress, tokenAddressses) {
                var web3, tokensData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, address, tokenData;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                web3 = new _web2.default(new _web2.default.providers.HttpProvider(rskRpcEndpoint));
                                tokensData = [];
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context.prev = 5;
                                _iterator = tokenAddressses[Symbol.iterator]();

                            case 7:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context.next = 16;
                                    break;
                                }

                                address = _step.value;
                                _context.next = 11;
                                return this.retrieveTokenData(nodeLuminoAddress, address, web3);

                            case 11:
                                tokenData = _context.sent;

                                tokensData.push(tokenData);

                            case 13:
                                _iteratorNormalCompletion = true;
                                _context.next = 7;
                                break;

                            case 16:
                                _context.next = 22;
                                break;

                            case 18:
                                _context.prev = 18;
                                _context.t0 = _context['catch'](5);
                                _didIteratorError = true;
                                _iteratorError = _context.t0;

                            case 22:
                                _context.prev = 22;
                                _context.prev = 23;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 25:
                                _context.prev = 25;

                                if (!_didIteratorError) {
                                    _context.next = 28;
                                    break;
                                }

                                throw _iteratorError;

                            case 28:
                                return _context.finish(25);

                            case 29:
                                return _context.finish(22);

                            case 30:
                                return _context.abrupt('return', tokensData);

                            case 31:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[5, 18, 22, 30], [23,, 25, 29]]);
            }));

            function retrieveTokensData(_x, _x2, _x3) {
                return _ref.apply(this, arguments);
            }

            return retrieveTokensData;
        }()
    }, {
        key: 'retrieveTokenData',


        /**
         * Invoke a specific contract in a blockchain to get token details.
         *
         * @param nodeLuminoAddress
         * @param address
         * @param web3
         * @returns {Promise<ERC20Token>}
         */
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(nodeLuminoAddress, address, web3) {
                var contract, name, symbol, decimals, balance;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                contract = new web3.eth.Contract(_ERC20StandardAbi.tokenAbi, address);
                                _context2.next = 3;
                                return contract.methods.name.call({
                                    gasPrice: 21000
                                });

                            case 3:
                                name = _context2.sent;
                                _context2.next = 6;
                                return contract.methods.symbol.call({
                                    gasPrice: 21000
                                });

                            case 6:
                                symbol = _context2.sent;
                                _context2.next = 9;
                                return contract.methods.decimals.call({
                                    gasPrice: 21000
                                });

                            case 9:
                                decimals = _context2.sent;
                                _context2.next = 12;
                                return contract.methods.balanceOf(nodeLuminoAddress).call({
                                    gasPrice: 21000
                                });

                            case 12:
                                balance = _context2.sent;
                                return _context2.abrupt('return', new _ERC20Token2.default(address, name, symbol, decimals, balance));

                            case 14:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function retrieveTokenData(_x4, _x5, _x6) {
                return _ref2.apply(this, arguments);
            }

            return retrieveTokenData;
        }()
    }]);

    return BlockChainService;
}();

exports.default = BlockChainService;
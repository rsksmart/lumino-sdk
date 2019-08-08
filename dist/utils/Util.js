'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bignumber = require('bignumber.js');

var _bignumber2 = _interopRequireDefault(_bignumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @classdesc Represents an Util Class.
 * @class
 * @abstract
 */
var Util = function () {
    function Util() {
        _classCallCheck(this, Util);
    }

    _createClass(Util, [{
        key: 'toWei',


        /**
         * Convert number value to wei unit value.
         *
         * @param amount {number}
         * @param decimals {number}
         * @returns {number}
         */
        value: function toWei(amount, decimals) {
            amount = new _bignumber2.default(amount);
            return amount.multipliedBy(Math.pow(10, decimals)).toString(10);
        }
    }, {
        key: 'getDecimals',


        /**
         * Get token decimal value from a list of tokens.
         *
         * @param address {String}
         * @param tokens  {String}
         * @returns {number}
         */
        value: function getDecimals(address, tokens) {
            var token = tokens.find(function (t) {
                return t.address === address;
            });
            if (token) {
                return token.decimals;
            } else {
                return null;
            }
        }
    }]);

    return Util;
}();

exports.default = Util;
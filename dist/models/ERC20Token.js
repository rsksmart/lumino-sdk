"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 ** @classdesc Represents the ERC20 token
 *    is a standard interface that guarantees interoperability between tokens
 * @class
 */
var ERC20Token = function ERC20Token(address, name, symbol, decimals, balance) {
    _classCallCheck(this, ERC20Token);

    this.address = address;
    this.name = name;
    this.symbol = symbol;
    this.decimals = decimals;
    this.balance = balance;
};

exports.default = ERC20Token;
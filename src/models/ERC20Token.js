/**
 ** @classdesc Represents the ERC20 token
 *    is a standard interface that guarantees interoperability between tokens
 * @class
 */
export default class ERC20Token {

    constructor(address, name, symbol, decimals, balance) {
        this.address = address;
        this.name = name;
        this.symbol = symbol;
        this.decimals = decimals;
        this.balance = balance;
    }
}

import BigNumber from 'bignumber.js';

/**
 * @classdesc Represents an Util Class.
 * @class
 * @abstract
 */
export default class Util {

    /**
     * Convert number value to wei unit value.
     *
     * @param amount {number}
     * @param decimals {number}
     * @returns {number}
     */
    toWei (amount, decimals) {
        amount = new BigNumber(amount);
        return amount.multipliedBy(Math.pow(10, decimals)).toString(10);
    };

    /**
     * Get token decimal value from a list of tokens.
     *
     * @param address {String}
     * @param tokens  {String}
     * @returns {number}
     */
    getDecimals (address, tokens) {
        const token= tokens.find((t)=> t.address === address);
        if(token){
            return token.decimals;
        }else{
            return null;
        }
    };
}

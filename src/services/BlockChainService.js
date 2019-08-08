import Web3 from 'web3';
import { tokenAbi } from '../models/abi/ERC20StandardAbi';
import ERC20Token from '../models/ERC20Token';

/**
 * @classdesc Represents an BlockChainService.
 * @class
 * @abstract
 */
export default class BlockChainService {

    /**
     * This method is for get data from RSK blockchain, when token addresses list is provided.
     *
     * @param rskRpcEndpoint
     * @param nodeLuminoAddress
     * @param tokenAddressses
     * @returns {Promise<Array>}
     */
    async retrieveTokensData (rskRpcEndpoint, nodeLuminoAddress, tokenAddressses) {
        const web3 = new Web3(new Web3.providers.HttpProvider(rskRpcEndpoint));
        const tokensData = [];
        for (const address of tokenAddressses) {
            const tokenData = await this.retrieveTokenData(nodeLuminoAddress, address, web3);
            tokensData.push(tokenData);
        }
        return tokensData;
    };

    /**
     * Invoke a specific contract in a blockchain to get token details.
     *
     * @param nodeLuminoAddress
     * @param address
     * @param web3
     * @returns {Promise<ERC20Token>}
     */
    async retrieveTokenData (nodeLuminoAddress, address, web3) {
        const contract = new web3.eth.Contract(tokenAbi, address);
        const name = await contract.methods.name.call({
            gasPrice: 21000
        });
        const symbol = await contract.methods.symbol.call({
            gasPrice: 21000
        });
        const decimals = await contract.methods.decimals.call({
            gasPrice: 21000
        });
        const balance = await contract.methods.balanceOf(nodeLuminoAddress).call({
            gasPrice: 21000
        });

        return new ERC20Token(address, name, symbol, decimals, balance);
    };


}

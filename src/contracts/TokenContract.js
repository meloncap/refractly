import TokenContractABI from './token-contract.json';

export class TokenContract {
    constructor(web3, tokenAddress, account) {
        this.account = account;
        this.contract = new web3.eth.Contract(TokenContractABI, tokenAddress);
    }

    getBalanceOf = async () => {
        return await this.contract.methods.balanceOf(this.account).call();
    }

    getSymbol = async () => {
        return await this.contract.methods.symbol().call();
    }
}

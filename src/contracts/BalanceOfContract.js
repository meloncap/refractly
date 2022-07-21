import BalanceOfContractABI from './balanceOf-contract.json';

export class BalanceOfContract {
    constructor(web3, tokenAddress, account) {
        this.account = account;
        this.contract = new web3.eth.Contract(BalanceOfContractABI, tokenAddress);
    }

    getBalanceOf = async () => {
        return await await this.contract.methods.balanceOf(this.account).call();
    }
}

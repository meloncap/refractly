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

    allowance = async (spender) => {
        return await this.contract.methods.allowance(this.account, spender);
    }

    approve = async (spender) => {
        return await this.contract.methods.approve(spender, "115792089237316195423570985008687907853269984665640564039457584007913129639935");
    }
}

import routerABI from './dystrouter-contract.json';

export class RouterContract {
    constructor(web3, account) {
        this.account = account;
        this.contract = new web3.eth.Contract(routerABI, "0xbe75dd16d029c6b32b7ad57a0fd9c1c20dd2862e");
    }

    getAmountOut = async (amount, token0, token1) => {
        return await this.contract.methods.getAmountOut(amount, token0, token1).call();
    }

    swapExactTokensForTokens = async (amountIn, amountOutMin, routes) => {
        const slippageAmount = Math.round(Number(amountOutMin) * 98 / 100).toString();
        return await this.contract.methods.swapExactTokensForTokens(amountIn, slippageAmount, routes, this.account, "9999999999999999")
            .send({ from: this.account, gasPrice: '30000000000' /* 31 */ })
    }
}

import lpContractABI from './lp-contract.json';

export class LPContract {
    constructor(web3, poolAddress) {
        this.contract = new web3.eth.Contract(lpContractABI, poolAddress);
    }

    getToken0 = async () => {
        return await this.contract.methods.token0().call();
    }

    getToken1 = async () => {
        return await this.contract.methods.token1().call();
    }

    getReserve0 = async () => {
        return await this.contract.methods.reserve0().call();
    }

    getReserve1 = async () => {
        return await this.contract.methods.reserve1().call();
    }

    getTotalSupply = async () => {
        return await this.contract.methods.totalSupply().call();
    }

    isStable = async () => {
        return await this.contract.methods.stable().call();
    }
}

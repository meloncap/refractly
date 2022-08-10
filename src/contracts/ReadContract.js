import readContractABI from './read-contract.json';

export class ReadContract {
    constructor(web3, account) {
        this.account = account;
        this.contract = new web3.eth.Contract(readContractABI, "0x1432c3553fdf7fbd593a84b3a4d380c643cbf7a2");
    }

    getDystWalletBalance = async () => {
        const dystBalance = await this.contract.methods.dystBalanceOf(this.account).call();
        return Number(dystBalance);
    }
    
    getPenDystWalletBalance = async () => {
        const penDystBalance = await this.contract.methods.penDystBalanceOf(this.account).call();
        return Number(penDystBalance);
    }
    
    getPenDystStakedBalance = async () => {
        const penDystBalance =  await this.contract.methods.stakedPenDystBalanceOf(this.account).call();
        return Number(penDystBalance);
    }
    
    getLockedPenData = async () => {
        const userProxy = await this.contract.methods.userProxyByAccount(this.account).call();
        const lockedData = await this.contract.methods.vlPenLocksData(userProxy).call();
        return lockedData;
    }

    getVlPenRewardTokenPositionsOf = async () => {
        return await this.contract.methods.vlPenRewardTokenPositionsOf(this.account).call();
    }
    
    getPenDystRewardPoolPosition = async () => {
        return await this.contract.methods.penDystRewardPoolPosition(this.account).call();
    }
    
    getStakingPoolsPositions = async () => {
        return await this.contract.methods.stakingPoolsPositions(this.account).call();
    }
}

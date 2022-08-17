import { BaseReadContract } from '../base/BaseReadContract';
import readContractABI from './read-contract.json';

export class PenroseReadContract extends BaseReadContract {
    constructor(web3, account) {
        super(web3, account, "0x1432c3553fdf7fbd593a84b3a4d380c643cbf7a2", readContractABI);
    }

    getDexTokenWalletBalance = async () => {
        const dystBalance = await this.contract.methods.dystBalanceOf(this.account).call();
        return Number(dystBalance);
    }
    
    getOptimizerTokenWalletBalance = async () => {
        const penDystBalance = await this.contract.methods.penDystBalanceOf(this.account).call();
        return Number(penDystBalance);
    }
    
    getOptimizerTokenStakedBalance = async () => {
        const penDystBalance =  await this.contract.methods.stakedPenDystBalanceOf(this.account).call();
        return Number(penDystBalance);
    }
    
    getOptimizerLockTokenData = async () => {
        const userProxy = await this.contract.methods.userProxyByAccount(this.account).call();
        const lockedData = await this.contract.methods.vlPenLocksData(userProxy).call();
        return lockedData;
    }

    getOptimizerLockTokenRewards = async () => {
        return await this.contract.methods.vlPenRewardTokenPositionsOf(this.account).call();
    }
    
    getOptimizerTokenRewards = async () => {
        return await this.contract.methods.penDystRewardPoolPosition(this.account).call();
    }
    
    getStakingPoolsPositions = async () => {
        return await this.contract.methods.stakingPoolsPositions(this.account).call();
    }
}
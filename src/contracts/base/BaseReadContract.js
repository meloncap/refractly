
export class BaseReadContract {
    constructor(web3, account, contractAddress, abi) {
        this.account = account;
        this.contract = new web3.eth.Contract(abi, contractAddress);
    }

    getDexTokenWalletBalance = async () => {
        return 0;
    }
    
    getOptimizerTokenWalletBalance = async () => {
        return 0;
    }
    
    getOptimizerTokenStakedBalance = async () => {
        return 0;
    }
    
    getOptimizerLockTokenData = async () => {
        return {};
    }

    getOptimizerLockTokenRewards = async () => {
        return {};
    }
    
    getOptimizerTokenRewards = async () => {
        return {};
    }
    
    getStakingPoolsPositions = async () => {
        return {};
    }
}

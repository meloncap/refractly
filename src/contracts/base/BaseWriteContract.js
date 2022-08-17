
export class BaseWriteContract {
    constructor(web3, account, contractAddress, abi) {
        this.account = account;
        this.contract = new web3.eth.Contract(abi, contractAddress);
    }

    claimAll = async () => {
        return;
    }
    
    claimLpRewards = async () => {
        return;
    }
    
    convertDexTokenToOptimizerVoteTokenAndStake = async () => {
        return;
    }
    
    stakeOptimizerVoteTokens = async () => {
        return;
    }

    voteLockOptimizerLockTokens = async () => {
        return;
    }
}

import { WriteContract } from "./contracts/WriteContract";

export const claimRewards = async (web3, account, actions) => {
    try {
        const writeContract = new WriteContract(web3, account);
        for (const action of actions) {
            let method = actionMethods[action];
            await method(writeContract);
        }
    } catch(err) {
        console.log(err);
    }
}

const claimAllStakingRewards = (contract) => {
    contract.claimAll();
}

const actionMethods = {
    1: claimAllStakingRewards
};

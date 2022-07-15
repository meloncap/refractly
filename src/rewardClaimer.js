export const claimRewards = async (contract, account, actions) => {
    try {
        for (const action of actions) {
            let method = actionMethods[action];
            await method(contract, account);
        }
    } catch(err) {
        console.log(err);
    }
}

const claimAllStakingRewards = (contract, account) => {
    console.log('Start claimAllStakingRewards')
    return new Promise(resolve => {
        contract.methods.claimAllStakingRewards().send({ from: account, gasPrice: '50000000000' /* 50 */ })
        .on('receipt', function(receipt){
            console.log('Done claimAllStakingRewards')
            console.log(receipt);
            resolve(receipt);
        })
        .on('error', function(error, receipt) {
            console.log("Error occured in transaction: ", error)
        })
    })
}

const actionMethods = {
    1: claimAllStakingRewards
};

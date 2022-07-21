import writeContractABI from './write-contract.json';

export class WriteContract {
    constructor(web3, account) {
        this.account = account;
        this.contract = new web3.eth.Contract(writeContractABI, "0xc9Ae7Dac956f82074437C6D40f67D6a5ABf3E34b");
    }

    claimAll = async () => {
        console.log('Start claimAllStakingRewards')
        return new Promise(resolve => {
            this.contract.methods.claimAllStakingRewards().send({ from: this.account, gasPrice: '50000000000' /* 50 */ })
                .on('receipt', function(receipt){
                    console.log('Done claimAllStakingRewards')
                    console.log(receipt);
                    resolve(receipt);
                })
                .on('error', function(error, receipt) {
                    console.log("Error occured in transaction: ", error)
                });
        });
    }
}

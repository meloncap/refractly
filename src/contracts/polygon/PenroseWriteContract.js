import { BaseWriteContract } from '../base/BaseWriteContract';
import writeContractABI from './write-contract.json';

export class PenroseWriteContract extends BaseWriteContract {
    constructor(web3, account) {
      super(web3, account, "0xc9Ae7Dac956f82074437C6D40f67D6a5ABf3E34b", writeContractABI);
    }

    claimAll = async () => {
        console.log('Start claimAllStakingRewards')
        return new Promise((resolve, reject) => {
            this.contract.methods.claimAllStakingRewards().send({ from: this.account, gasPrice: '50000000000' /* 50 */ })
                .on('receipt', function(receipt){
                    console.log('Done claimAllStakingRewards')
                    console.log(receipt);
                    resolve(receipt);
                })
                .on('error', function(error, receipt) {
                    console.log("Error occured in transaction: ", error)
                    reject(error);
                });
        });
    }

    claimLpRewards = async () => {
      console.log('Start claimStakingRewards')
      return new Promise((resolve, reject) => {
          this.contract.methods.claimStakingRewards().send({ from: this.account, gasPrice: '35000000000' /* 35 */ })
              .on('receipt', function(receipt){
                  console.log('Done claimStakingRewards')
                  console.log(receipt);
                  resolve(receipt);
              })
              .on('error', function(error, receipt) {
                  console.log("Error occured in transaction: ", error)
                  reject(error);
              });
      });
    }

    convertDexTokenToOptimizerVoteTokenAndStake = async () => {
        console.log('Start convertDystToPenDystAndStake')
        return new Promise((resolve, reject) => {
            this.contract.methods.convertDystToPenDystAndStake().send({ from: this.account, gasPrice: '35000000000' /* 35 */ })
            .on('receipt', function(receipt){
              console.log('Done convertDystToPenDystAndStake')
              console.log(receipt);
              resolve(receipt);
            })
            .on('error', function(error, receipt) {
              console.log("Error occured in transaction: ", error)
              reject(error);
            })
        })
      }
    
      stakeOptimizerVoteTokens = async () => {
        console.log('Start stakePenDyst')
        return new Promise((resolve, reject) => {
            this.contract.methods.stakePenDyst().send({ from: this.account, gasPrice: '35000000000' /* 35 */ })
            .on('receipt', function(receipt){
              console.log('Done stakePenDyst')
              console.log(receipt);
              resolve(receipt);
            })
            .on('error', function(error, receipt) {
              console.log("Error occured in transaction: ", error)
              reject(error);
            })
        })
      }
    
      voteLockOptimizerLockTokens = async (penAmount) => {
        console.log('Start voteLockPen')
        return new Promise((resolve, reject) => {
            this.contract.methods.voteLockPen(penAmount, 0).send({ from: this.account, gasPrice: '40000000000' /* 40 */ })
            .on('receipt', function(receipt){
              console.log('Done voteLockPen')
              console.log(receipt);
              resolve(receipt);
            })
            .on('error', function(error, receipt) {
              console.log("Error occured in transaction: ", error)
              reject(error);
            })
        })
      }
}

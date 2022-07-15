import Web3 from 'web3';
import readContractABI from './contracts/read-contract.json'
import writeContractABI from './contracts/write-contract.json'

export const getReadContract = async (provider) => {
    window.web3 = new Web3(provider);
    return await new window.web3.eth.Contract(readContractABI, "0x1432c3553fdf7fbd593a84b3a4d380c643cbf7a2");
}

export const getWriteContract = async (provider) => {
    window.web3 = new Web3(provider);
    return await new window.web3.eth.Contract(writeContractABI, "0xc9Ae7Dac956f82074437C6D40f67D6a5ABf3E34b");
}
import { ReadContract } from "./contracts/ReadContract";
import { TokenContract } from "./contracts/TokenContract";
import { LPContract } from "./contracts/LPContract";
import { addPrices, addSymbols } from "./tokenFetcher";

export const dystAddr = "0x39aB6574c289c3Ae4d88500eEc792AB5B947A5Eb";
export const penAddr = "0x9008D70A5282a936552593f410AbcBcE2F891A97";
export const penDystAddr = "0x5b0522391d0A5a37FD117fE4C43e8876FB4e91E6";
// const usdtAddr = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
export const usdcAddr = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
export const usdPlusAddr = "0x236eeC6359fb44CCe8f97E99387aa7F8cd5cdE1f";
export const kogeAddr = "0x13748d548D95D78a3c83fe3F32604B4796CFfa23";
export const clamAddr = "0xC250e9987A032ACAC293d838726C511E6E1C029d";

export const getProfile = async (web3, account) => {
    try {
        const readContract = new ReadContract(web3, account);

        let balances = [];

        const walletAndStakedBalances = await getWalletAndStakedBalances(web3, account, readContract);

        balances.push(walletAndStakedBalances);

        let totalRewards = [];

        const [
            vIPenRewards,
            penDystRewards,
            { pools, poolBalance, poolRewards }
        ] = await Promise.all([
            getvIPenRewards(readContract),
            getPenDystRewards(readContract),
            getPoolsPositions(readContract, web3)
        ]);

        totalRewards.push(vIPenRewards);
        totalRewards.push(penDystRewards);
        totalRewards.push(poolRewards);
        balances.push(poolBalance);

        const [
            rewards,
            combinedBalances
        ] = await Promise.all([
            combineRewards(totalRewards),
            combineBalances(balances)
        ]);

        const rewardTokens = Object.keys(rewards).reduce((a, v) => ({ ...a, [v]: undefined}), {});
        const balanceTokens = Object.keys(combinedBalances).reduce((a, v) => ({ ...a, [v]: undefined}), {});
        const tokenPriceObj = Object.assign(rewardTokens, balanceTokens);
        const tokenSymbolObj = structuredClone(tokenPriceObj);

        await Promise.all([
            addPrices(tokenPriceObj),
            addSymbols(web3, tokenSymbolObj)
        ]);

        const profile = {
            "balances": combinedBalances,
            "rewards": rewards,
            "pools": pools,
            "prices": tokenPriceObj,
            "symbols": tokenSymbolObj
        };

        return profile;
    } catch(err) {
      console.log(err);
    }
}

const getWalletAndStakedBalances = async (web3, account, readContract) => {
    const tokenContract = new TokenContract(web3, penAddr, account);
    const [
        dystBalance,
        penDystBalance,
        penDystStakedBalance,
        lockedPenData,
        penBalance
    ] = await Promise.all([
        readContract.getDystWalletBalance(),
        readContract.getPenDystWalletBalance(),
        readContract.getPenDystStakedBalance(),
        readContract.getLockedPenData(),
        tokenContract.getBalanceOf()
    ]);

    let walletAndStakedBalances = {};
    walletAndStakedBalances[dystAddr] = dystBalance;
    walletAndStakedBalances[penDystAddr] = penDystBalance + penDystStakedBalance;
    walletAndStakedBalances[penAddr] = Number(penBalance) + Number(lockedPenData.total);

    return walletAndStakedBalances;
}

const getvIPenRewards = async (contract) => {
    const result = await contract.getVlPenRewardTokenPositionsOf()
    const rewards = result.reduce((a, v) => ({ ...a, [v.rewardTokenAddress]: {earned: Number(v.earned), vIPenEarned: Number(v.earned)}}), {});
    return rewards;
}

const getPenDystRewards = async (contract) => {
    const result = await contract.getPenDystRewardPoolPosition();
    const rewards = result.reduce((a, v) => ({ ...a, [v.rewardTokenAddress]: {earned: Number(v.earned), penDystEarned: Number(v.earned)}}), {});
    return rewards;
}

// returns { pools, poolBalance, poolRewards }
const getPoolsPositions = async (contract, web3) => {
    const positions = await contract.getStakingPoolsPositions();

    const poolRewards = positions.reduce((basket, rewards) => {
        for (const [, rewardData] of Object.entries(rewards.rewardTokens)) {
            if (!basket[rewardData.rewardTokenAddress]) {
                basket[rewardData.rewardTokenAddress] = {earned: Number(0), poolEarned: Number(0)};
            }
    
            basket[rewardData.rewardTokenAddress].earned += Number(rewardData.earned);
            basket[rewardData.rewardTokenAddress].poolEarned += Number(rewardData.earned);
        }
    
        return basket;
    }, {});

    const poolBalance = {};
    const pools = [];
    for (const position of positions) {
        const lpContract = new LPContract(web3, position.dystPoolAddress);

        const [
            token0,
            token1,
            reserve0,
            reserve1,
            totalSupply,
            isStable
        ] = await Promise.all([
            lpContract.getToken0(),
            lpContract.getToken1(),
            lpContract.getReserve0(),
            lpContract.getReserve1(),
            lpContract.getTotalSupply(),
            lpContract.isStable(),
        ]);

        // user LP amount / total LP amount * reserve amount
        let token0Amount = Number(position.balanceOf) / Number(totalSupply) * Number(reserve0);
        let token1Amount = Number(position.balanceOf) / Number(totalSupply) * Number(reserve1);


        // handle contract bugs
        if (token0 === usdcAddr || token0 === usdPlusAddr) {
            token0Amount *= 10**12;
        } else if (token0 === kogeAddr || token0 === clamAddr) {
            token0Amount *= 10**9;
        }
        if (token1 === usdcAddr || token1 === usdPlusAddr) {
            token1Amount *= 10**12;
        } else if (token1 === kogeAddr || token1 === clamAddr) {
            token1Amount *= 10**9;
        }

        if (!poolBalance[token0]) {
            poolBalance[token0] = 0;
        }

        if (!poolBalance[token1]) {
            poolBalance[token1] = 0;
        }

        poolBalance[token0] += token0Amount;
        poolBalance[token1] += token1Amount;

        pools.push({
            "token0": token0,
            "token1": token1,
            "amount0": token0Amount / 10 ** 18,
            "amount1": token1Amount / 10 ** 18,
            "stable": isStable,
        })
    }

    return { pools, poolBalance, poolRewards};
}

const combineRewards = (rewardList) => {
    const combinedRewards = rewardList.reduce((basket, rewards) => {
        for (const [address, rewardData] of Object.entries(rewards)) {
            if (!basket[address]) {
                basket[address] = {earned: Number(0), vIPenEarned: Number(0), penDystEarned: Number(0), poolEarned: Number(0)};
            }
    
            basket[address].earned += Number(rewardData.earned);

            if (rewardData.vIPenEarned)
                basket[address].vIPenEarned += Number(rewardData.vIPenEarned);
            if (rewardData.penDystEarned)
                basket[address].penDystEarned += Number(rewardData.penDystEarned);
            if (rewardData.poolEarned)
                basket[address].poolEarned += Number(rewardData.poolEarned);
        }
    
        return basket;
      }, {});

    return combinedRewards;
}

const combineBalances = (balanceList) => {
    const combinedBalances = balanceList.reduce((basket, balances) => {
        for (const [address, balance] of Object.entries(balances)) {
            if (!basket[address]) {
                basket[address] = Number(0)
            }
    
            basket[address] += Number(balance);
        }
    
        return basket;
      }, {});

    return combinedBalances;
}

import { PenroseReadContract } from "./contracts/polygon/PenroseReadContract";
import { TokenContract } from "./contracts/base/TokenContract";
import { LPContract } from "./contracts/base/LPContract";
import { addPrices, addSymbols } from "./utils/tokenFetcher";
import { ChainPriceNames, PolygonAddresses, PolygonTokens } from "./utils/chains";

export const getPolygonProfile = async (web3, account) => {
    try {
        const readContract = new PenroseReadContract(web3, account);

        let balances = [];

        const walletAndStakedBalances = await getWalletAndStakedBalances(web3, account, readContract);

        balances.push(walletAndStakedBalances);

        let totalRewards = [];

        const [
            vlPenRewards,
            penDystRewards,
            { pools, poolBalance, poolRewards }
        ] = await Promise.all([
            getvlPenRewards(readContract),
            getPenDystRewards(readContract),
            getPoolsPositions(readContract, web3)
        ]);

        totalRewards.push(vlPenRewards);
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
        const balanceTokens = Object.keys(combinedBalances).reduce((a, v) => {
            if(v === PolygonTokens.OptimizerVoteToken) {
                return a;
            }
            return { ...a, [v]: undefined};
        },
            {}
        );
        const tokenPriceObj = Object.assign(rewardTokens, balanceTokens);
        const tokenSymbolObj = structuredClone(tokenPriceObj);

        await Promise.all([
            addPrices(tokenPriceObj, ChainPriceNames.Polygon),
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
    const tokenContract = new TokenContract(web3, PolygonAddresses.Pen, account);
    const [
        dystBalance,
        penDystBalance,
        penDystStakedBalance,
        lockedPenData,
        penBalance
    ] = await Promise.all([
        readContract.getDexTokenWalletBalance(),
        readContract.getOptimizerTokenWalletBalance(),
        readContract.getOptimizerTokenStakedBalance(),
        readContract.getOptimizerLockTokenData(),
        tokenContract.getBalanceOf()
    ]);

    let walletAndStakedBalances = {};
    walletAndStakedBalances[PolygonAddresses.Dyst] = dystBalance;
    walletAndStakedBalances[PolygonAddresses.PenDyst] = penDystBalance + penDystStakedBalance;
    walletAndStakedBalances[PolygonAddresses.Pen] = Number(penBalance) + Number(lockedPenData.total);
    walletAndStakedBalances[PolygonAddresses.VlPen] = Number(lockedPenData.total);
    walletAndStakedBalances[PolygonTokens.OptimizerVoteToken] = penDystStakedBalance;


    return walletAndStakedBalances;
}

const getvlPenRewards = async (contract) => {
    const result = await contract.getOptimizerLockTokenRewards()
    const rewards = result.reduce((a, v) => ({ ...a, [v.rewardTokenAddress]: {earned: Number(v.earned), optimizerLockEarned: Number(v.earned)}}), {});
    return rewards;
}

const getPenDystRewards = async (contract) => {
    const result = await contract.getOptimizerTokenRewards();
    const rewards = result.reduce((a, v) => ({ ...a, [v.rewardTokenAddress]: {earned: Number(v.earned), optimizerVoteEarned: Number(v.earned)}}), {});
    return rewards;
}

// returns { pools, poolBalance, poolRewards }
const getPoolsPositions = async (contract, web3) => {
    const positions = await contract.getStakingPoolsPositions();

    const poolBalance = {};
    const poolRewards = {};
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
        if (token0 === PolygonAddresses.Usdc || token0 === PolygonAddresses.UsdPlus) {
            token0Amount *= 10**12;
        } else if (token0 === PolygonAddresses.Koge || token0 === PolygonAddresses.Clam) {
            token0Amount *= 10**9;
        }
        if (token1 === PolygonAddresses.Usdc || token1 === PolygonAddresses.UsdPlus) {
            token1Amount *= 10**12;
        } else if (token1 === PolygonAddresses.Koge || token1 === PolygonAddresses.Clam) {
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

        let poolObj = {
            "token0": token0,
            "token1": token1,
            "amount0": token0Amount / 10 ** 18,
            "amount1": token1Amount / 10 ** 18,
            "stable": isStable,
            "rewards": {}
        };

        for (const [, rewardData] of Object.entries(position.rewardTokens)) {
            if (!poolRewards[rewardData.rewardTokenAddress]) {
                poolRewards[rewardData.rewardTokenAddress] = {earned: Number(0), poolEarned: Number(0)};
            }
    
            poolRewards[rewardData.rewardTokenAddress].earned += Number(rewardData.earned);
            poolRewards[rewardData.rewardTokenAddress].poolEarned += Number(rewardData.earned);

            poolObj.rewards[rewardData.rewardTokenAddress] = Number(rewardData.earned) / 10**18;
        }

        pools.push(poolObj);
    }

    return { pools, poolBalance, poolRewards};
}

const combineRewards = (rewardList) => {
    const combinedRewards = rewardList.reduce((basket, rewards) => {
        for (const [address, rewardData] of Object.entries(rewards)) {
            if (!basket[address]) {
                basket[address] = {earned: Number(0), optimizerLockEarned: Number(0), optimizerVoteEarned: Number(0), poolEarned: Number(0)};
            }
    
            basket[address].earned += Number(rewardData.earned);

            if (rewardData.optimizerLockEarned)
                basket[address].optimizerLockEarned += Number(rewardData.optimizerLockEarned);
            if (rewardData.optimizerVoteEarned)
                basket[address].optimizerVoteEarned += Number(rewardData.optimizerVoteEarned);
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

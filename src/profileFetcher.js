import { ReadContract } from "./contracts/ReadContract";
import { TokenContract } from "./contracts/TokenContract";
import { LPContract } from "./contracts/LPContract";

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

        let balances = []

        let walletAndStakedBalances = {};
        walletAndStakedBalances[dystAddr] = dystBalance;
        walletAndStakedBalances[penDystAddr] = penDystBalance + penDystStakedBalance;
        walletAndStakedBalances[penAddr] = Number(penBalance) + Number(lockedPenData.total);

        balances.push(walletAndStakedBalances);

        let totalRewards = [];

        const [
            vIPenRewards,
            penDystRewards,
            { poolBalance, poolRewards }
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

        await Promise.all([
            addPrices(rewards),
            addSymbols(web3, rewards)
        ]);

        const profileBalances = await getProfileBalances(combinedBalances, rewards);

        const profile = {
            "balances": profileBalances,
            "rewards": rewards
        };

        return profile;
    } catch(err) {
      console.log(err);
    }
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

// returns { poolBalance, poolRewards }
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

    const poolBalance = {}
    for (const position of positions) {
        const lpContract = new LPContract(web3, position.dystPoolAddress);

        const [
            token0,
            token1,
            reserve0,
            reserve1,
            totalSupply
        ] = await Promise.all([
            lpContract.getToken0(),
            lpContract.getToken1(),
            lpContract.getReserve0(),
            lpContract.getReserve1(),
            lpContract.getTotalSupply(),
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
    }

    return { poolBalance, poolRewards};
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

const getProfileBalances = async (balances, rewards) => {
    let profile = {};

    const addressesToFetch = [];

    for (const [address, balance] of Object.entries(balances)) {
        if (rewards[address]) {
            profile[address] = balance / 10 ** 18 * rewards[address].price;
            continue;
        }

        addressesToFetch.push(address);

        // try {
        //     const addresses = Object.keys(rewards).map((address) => address).join();
        //     const prices = await fetchPrices(addresses);
        //     for (const [address, data] of Object.entries(prices)) {
        //         const key = Object.keys(rewards).find(key => key.toLowerCase() === address)
        //         profile[key] = balance / 10 ** 18 * data.usd;
        //     }
        // } catch (err) {
        //     console.log(err);
        // }
    }

    try {
        const addresses = addressesToFetch.join();
        const prices = await fetchPrices(addresses);
        for (const [address, data] of Object.entries(prices)) {
            const key = Object.keys(balances).find(key => key.toLowerCase() === address)
            profile[key] = balances[key] / 10 ** 18 * data.usd;
        }
    } catch (err) {
        console.log(err);
    }

    return profile;
}

const addPrices = async (rewards) => {
    try {
        const addresses = Object.keys(rewards).map((address) => address).join();
        const prices = await fetchPrices(addresses);
        for (const [address, data] of Object.entries(prices)) {
            const key = Object.keys(rewards).find(key => key.toLowerCase() === address)
            rewards[key].price = data.usd;
        }

        // pendyst is a special case
        const response = await fetchNoCache(`https://api.dexscreener.com/latest/dex/tokens/${dystAddr}`)
        const data = await response.json();
        const pair = data.pairs.find(t => t.baseToken.symbol === 'DYST' && t.quoteToken.symbol === "penDYST");
        rewards[penDystAddr].price = Number(pair.priceUsd / pair.priceNative);

        // Try and get tokens there we couldn't get a price for
        await getPricesFromDexScreener(rewards);
    } catch (err) {
        console.log(err);
        await getPricesFromDexScreener(rewards);
    }
}

const getPricesFromDexScreener = async (rewards) => {
    for (const [address, rewardData] of Object.entries(rewards)) {
        if (rewardData.price) {
            continue;
        }

        const response = await fetchNoCache(`https://api.dexscreener.com/latest/dex/tokens/${address}`)
        const data = await response.json();

        if (data.pairs.length === 0) {
            rewardData.price = Number(0);
            continue;
        }

        let pair = data.pairs.find(t => t.baseToken.address ===  address);
        if (pair) {
            rewardData.price = Number(pair.priceUsd);
        } else {
            pair = data.pairs.find(t => t.quoteToken.address ===  address);
            rewardData.price = Number(pair.priceUsd / pair.priceNative);
        }
    }
}

const addSymbols = async (web3, rewards) => {
    for (const [address, rewardData] of Object.entries(rewards)) {
        const tokenContract = new TokenContract(web3, address, null);
        const symbol = await tokenContract.getSymbol();
        rewardData.symbol = symbol;
    }
}

const fetchPrices = async (addresses) => {
    const response = await fetchNoCache(`https://api.coingecko.com/api/v3/simple/token_price/polygon-pos?contract_addresses=${addresses}&vs_currencies=usd`);
    const data = await response.json();
    return data;
}

const fetchNoCache = async (url) => {
    return await fetch(url, {
        headers: {
            'Cache-Control': 'no-cache'
        }
    });
}
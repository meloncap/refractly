import { ReadContract } from "./contracts/ReadContract";
import { TokenContract } from "./contracts/TokenContract";

const dystAddr = "0x39aB6574c289c3Ae4d88500eEc792AB5B947A5Eb";
// const penAddr = "0x9008D70A5282a936552593f410AbcBcE2F891A97";
const penDystAddr = "0x5b0522391d0A5a37FD117fE4C43e8876FB4e91E6";
// const usdtAddr = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
// const usdcAddr = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

export const getRewards = async (web3, account) => {
    try {
        const readContract = new ReadContract(web3, account);

        let totalRewards = [];

        const vIPenRewards = await getvIPenRewards(readContract);
        totalRewards.push(vIPenRewards)

        const penDystRewards = await getPenDystRewards(readContract);
        totalRewards.push(penDystRewards)

        const poolRewards = await getPoolRewards(readContract);
        totalRewards.push(poolRewards);

        let rewards = combineRewards(totalRewards);

        await addPrices(rewards);
        await addSymbols(web3, rewards);

        return rewards;
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

const getPoolRewards = async (contract) => {
    const positions = await contract.getStakingPoolsPositions();

    const rewards = positions.reduce((basket, rewards) => {
        for (const [, rewardData] of Object.entries(rewards.rewardTokens)) {
            if (!basket[rewardData.rewardTokenAddress]) {
                basket[rewardData.rewardTokenAddress] = {earned: Number(0), poolEarned: Number(0)};
            }
    
            basket[rewardData.rewardTokenAddress].earned += Number(rewardData.earned);
            basket[rewardData.rewardTokenAddress].poolEarned += Number(rewardData.earned);
        }
    
        return basket;
    }, {});

    return rewards;
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
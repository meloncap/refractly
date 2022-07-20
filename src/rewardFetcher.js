const dystAddr = "0x39aB6574c289c3Ae4d88500eEc792AB5B947A5Eb";
// const penAddr = "0x9008D70A5282a936552593f410AbcBcE2F891A97";
const penDystAddr = "0x5b0522391d0A5a37FD117fE4C43e8876FB4e91E6";
const usdtAddr = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
const usdcAddr = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

export const getRewards = async (contract, account) => {
    try {
        let totalRewards = [];

        const vIPenRewards = await getvIPenRewards(contract, account);
        totalRewards.push(vIPenRewards)

        const penDystRewards = await getPenDystRewards(contract, account);
        totalRewards.push(penDystRewards)

        const poolRewards = await getPoolRewards(contract, account);
        totalRewards.push(poolRewards);

        let rewards = combineRewards(totalRewards);

        await addPrices(rewards);

        return rewards;
    } catch(err) {
      console.log(err);
    }
}

const getvIPenRewards = async (contract, account) => {
    const result = await contract.methods.vlPenRewardTokenPositionsOf(account).call();
    const rewards = result.reduce((a, v) => ({ ...a, [v.rewardTokenAddress]: {earned: Number(v.earned), vIPenEarned: Number(v.earned)}}), {});
    return rewards;
}

const getPenDystRewards = async (contract, account) => {
    const result = await contract.methods.penDystRewardPoolPosition(account).call();
    const rewards = result.reduce((a, v) => ({ ...a, [v.rewardTokenAddress]: {earned: Number(v.earned), penDystEarned: Number(v.earned)}}), {});
    return rewards;
}

const getPoolRewards = async (contract, account) => {
    const positions = await contract.methods.stakingPoolsPositions(account).call();

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
    for (const [address, rewardData] of Object.entries(rewards)) {
        if (address === penDystAddr) {
          const response = await fetchNoCache(`https://api.dexscreener.com/latest/dex/tokens/${dystAddr}`)
          const data = await response.json();
          const pair = data.pairs.find(t => t.baseToken.symbol === 'DYST' && t.quoteToken.symbol === "penDYST");
          rewardData.symbol = pair.quoteToken.symbol;
          rewardData.price = Number(pair.priceUsd / pair.priceNative);
        } else if (address === usdtAddr) {
          const response = await fetchNoCache(`https://api.dexscreener.com/latest/dex/tokens/${usdcAddr}`)
          const data = await response.json();
          const pair = data.pairs.find(t => t.baseToken.symbol === 'USDC' && t.quoteToken.symbol === "USDT");
          rewardData.symbol = pair.quoteToken.symbol;
          rewardData.price = Number(pair.priceUsd / pair.priceNative);
        } else {
          const response = await fetchNoCache(`https://api.dexscreener.com/latest/dex/tokens/${address}`)
          const data = await response.json();

          if (data.pairs.length === 0) {
            rewardData.symbol = "?";
            rewardData.price = Number(1);
            continue;
          }

          let pair = data.pairs.find(t => t.baseToken.address ===  address);
          if (pair) {
            rewardData.symbol = pair.baseToken.symbol;
            rewardData.price = Number(pair.priceUsd);
          } else {
            pair = data.pairs.find(t => t.quoteToken.address ===  address);
            rewardData.symbol = pair.baseToken.symbol;
            rewardData.price = Number(pair.priceUsd / pair.priceNative);
          }
        }
    }
}

const fetchNoCache = async (url) => {
    return await fetch(url, {
        headers: {
            'Cache-Control': 'no-cache'
        }
    });
}
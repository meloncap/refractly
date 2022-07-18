const dystAddr = "0x39aB6574c289c3Ae4d88500eEc792AB5B947A5Eb";
// const penAddr = "0x9008D70A5282a936552593f410AbcBcE2F891A97";
const penDystAddr = "0x5b0522391d0A5a37FD117fE4C43e8876FB4e91E6";
const usdtAddr = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
const usdcAddr = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

export const getRewards = async (contract, account) => {
    try {
        const result = await contract.methods.vlPenRewardTokenPositionsOf(account).call();

        let totalRewards = [];
        const rewardObj = result.reduce((a, v) => ({ ...a, [v.rewardTokenAddress]: {earned: Number(v.earned)}}), {}) 
        totalRewards.push(rewardObj);

        const penDystResult = await contract.methods.penDystRewardPoolPosition(account).call();

        const reduced = penDystResult.reduce((a, v) => ({ ...a, [v.rewardTokenAddress]: {earned: Number(v.earned)}}), {});
        totalRewards.push(reduced);

        const positions = await contract.methods.stakingPoolsPositions(account).call();

        const poolRewards = positions.reduce((basket, rewards) => {
          for (const [, rewardData] of Object.entries(rewards.rewardTokens)) {
              if (!basket[rewardData.rewardTokenAddress]) {
                  basket[rewardData.rewardTokenAddress] = {earned: Number(rewardData.earned)};
              }
      
              basket[rewardData.rewardTokenAddress].earned += Number(rewardData.earned);
          }
      
          return basket;
        }, {});
        totalRewards.push(poolRewards);

        const allRewards = totalRewards.reduce((basket, rewards) => {
          for (const [address, rewardData] of Object.entries(rewards)) {
              if (!basket[address]) {
                  basket[address] = {earned: 0};
              }
      
              basket[address].earned += Number(rewardData.earned);
          }
      
          return basket;
        }, {});


        for (const [address, rewardData] of Object.entries(allRewards)) {
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

        return allRewards;
    } catch(err) {
      console.log(err);
    }
}

const fetchNoCache = async (url) => {
    return await fetch(url, {
        headers: {
            'Cache-Control': 'no-cache'
        }
    });
}
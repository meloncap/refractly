import { TokenContract } from "./contracts/TokenContract";
import { dystAddr, penDystAddr } from "./profileFetcher";

export const addPrices = async (tokenObj) => {
    try {
        const addresses = Object.keys(tokenObj).map((address) => address).join();
        const prices = await fetchPrices(addresses);
        for (const [address, data] of Object.entries(prices)) {
            const key = Object.keys(tokenObj).find(key => key.toLowerCase() === address)
            tokenObj[key] = data.usd;
        }

        // pendyst is a special case
        const response = await fetchNoCache(`https://api.dexscreener.com/latest/dex/tokens/${dystAddr}`)
        const data = await response.json();
        const pair = data.pairs.find(t => t.baseToken.symbol === 'DYST' && t.quoteToken.symbol === "penDYST");
        tokenObj[penDystAddr] = Number(pair.priceUsd / pair.priceNative);

        // Try and get tokens there we couldn't get a price for
        await getPricesFromDexScreener(tokenObj);
    } catch (err) {
        console.log(err);
        await getPricesFromDexScreener(tokenObj);
    }
}

const getPricesFromDexScreener = async (tokenObj) => {
    for (const [address, rewardData] of Object.entries(tokenObj)) {
        if (rewardData) {
            continue;
        }

        const response = await fetchNoCache(`https://api.dexscreener.com/latest/dex/tokens/${address}`)
        const data = await response.json();

        if (data.pairs.length === 0) {
            tokenObj[address] = Number(0);
            continue;
        }

        let pair = data.pairs.find(t => t.baseToken.address ===  address);
        if (pair) {
            tokenObj[address] = Number(pair.priceUsd);
        } else {
            pair = data.pairs.find(t => t.quoteToken.address ===  address);
            tokenObj[address] = Number(pair.priceUsd / pair.priceNative);
        }
    }
}

export const addSymbols = async (web3, tokenObj) => {
    for (const [address] of Object.entries(tokenObj)) {
        const tokenContract = new TokenContract(web3, address, null);
        const symbol = await tokenContract.getSymbol();
        tokenObj[address] = symbol;
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

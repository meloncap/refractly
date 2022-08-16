export const determineRoute = async (routerContract, fromToken, toToken, balance, middleTokens = []) => {
    let routeData = [];
    routeData.push(await calculateRoute(routerContract, fromToken, null, toToken, balance));

    for (const middleToken of middleTokens) {
        if (middleToken === toToken) continue;
        routeData.push(await calculateRoute(routerContract, fromToken, middleToken, toToken, balance));
    }

    routeData.sort(function(a, b) {
        return Number(b.amount) - Number(a.amount);
    });

    return routeData[0];
}

const calculateRoute = async (routerContract, fromToken, middleToken, toToken, balance) => {
    let routes = [];

    if (!middleToken) {
        const amountOut0 = await routerContract.getAmountOut(balance, fromToken, toToken);
        routes.push({from: fromToken, to: toToken, stable: amountOut0.stable});
        return {amount: amountOut0.amount, routes };
    }

    const amountOut0 = await routerContract.getAmountOut(balance, fromToken, middleToken);
    routes.push({from: fromToken, to: middleToken, stable: amountOut0.stable});

    const amountOut1 = await routerContract.getAmountOut(amountOut0.amount, middleToken, toToken);
    routes.push({from: middleToken, to: toToken, stable: amountOut1.stable});
    return {amount: amountOut1.amount, routes };
}

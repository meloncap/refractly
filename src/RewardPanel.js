import React from 'react';
import Grid from '@mui/material/Grid';
import DisplayBox from './DisplayBox';
import Tooltip from '@mui/material/Tooltip';
import { formatAsPercent } from './utils';

const RewardPanel = ({
    rewardData,
    prices,
    symbols
}) => {

    const diviser = 10 ** 18;

    if (!rewardData) {
        rewardData = {};
    }

    return (
        <Grid item container spacing={1} justifyContent="center">
            {Object.entries(rewardData).map((reward) => {
                const address = reward[0];
                const data = reward[1];
                const rewards = data.earned / diviser;

                let poolPercent = 0;
                let penDystPercent = 0;
                let vIPenPercent = 0;
                
                if (rewards > 0) {
                    poolPercent = (data.poolEarned / diviser) / rewards;
                    penDystPercent = (data.penDystEarned / diviser) / rewards;
                    vIPenPercent = (data.vIPenEarned / diviser) / rewards;
                }

                return (
                    <Grid item key={reward[0]}>
                        <Tooltip enterDelay={500} enterNextDelay={500} title={
                            <React.Fragment>
                            <b>Pool Staking: </b>{formatAsPercent(poolPercent)}<br></br>
                            <b>penDYST Staking: </b>{formatAsPercent(penDystPercent)}<br></br>
                            <b>vIPEN Locking: </b>{formatAsPercent(vIPenPercent)}
                            </React.Fragment>
                        }>
                            <DisplayBox
                                header={`${symbols[address]}`}
                                reward={rewards}
                                rewardLabel={symbols[address]}
                                rewardAmount={rewards * prices[address]}
                            ></DisplayBox>
                        </Tooltip>
                    </Grid>
                );
            })}
        </Grid>
    )
}

export default RewardPanel;
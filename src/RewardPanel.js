import React from 'react';
import Grid from '@mui/material/Grid';
import DisplayBox from './DisplayBox';
import Tooltip from '@mui/material/Tooltip';
import { formatAsPercent } from './utils';

const RewardPanel = ({
    rewardData
}) => {

    const diviser = 10 ** 18;

    if (!rewardData) {
        rewardData = {};
    }

    return (
        <Grid container spacing={1}>
            {Object.entries(rewardData).map((reward) => {
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
                                header={`${data.symbol} Rewards`}
                                reward={rewards}
                                rewardLabel={data.symbol}
                                rewardAmount={rewards * data.price}
                            ></DisplayBox>
                        </Tooltip>
                    </Grid>
                );
            })}
        </Grid>
    )
}

export default RewardPanel;
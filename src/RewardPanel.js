import React from 'react';
import Grid from '@mui/material/Grid';
import DisplayBox from './DisplayBox';
import Tooltip from '@mui/material/Tooltip';

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

                return (
                    <Grid item key={reward[0]}>
                        <Tooltip title={
                            <React.Fragment>
                            <b>Pool Staking: </b>{Number(data.poolEarned / diviser).toFixed(8)}<br></br>
                            <b>penDYST Staking: </b>{Number(data.penDystEarned / diviser).toFixed(8)}<br></br>
                            <b>vIPEN Locking: </b>{Number(data.vIPenEarned / diviser).toFixed(8)}
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
import React from 'react';
import { PolygonAddresses } from '../../utils/chains';
import Donations from '../base/Donations';

const PenroseDonations = () => {
  return (
    <Donations
      blockchain="polygon"
      addresses={[
        PolygonAddresses.Pen,
        PolygonAddresses.Dyst,
        PolygonAddresses.PenDyst,
        PolygonAddresses.UsdPlus,
        PolygonAddresses.Usdc,
        PolygonAddresses.WMatic,
        PolygonAddresses.Usdt
      ]}
    />
  )
}

export default PenroseDonations;

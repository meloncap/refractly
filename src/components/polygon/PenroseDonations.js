import React from 'react';
import { ChainNames, PolygonAddresses } from '../../utils/chains';
import Donations from '../base/Donations';

const PenroseDonations = () => {
  return (
    <Donations
      blockchain={ChainNames.Polygon}
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

import React from 'react';
import { Tabs } from 'antd';
import { PnlDashboard } from './PnlDashboard';
import { PnlRawData } from './PnLRawData';

export const PnlDashboardMain: React.FC = () => {
  return (
    <Tabs
      defaultActiveKey="pnl"
      items={[
        {
          key: 'raw',
          label: 'Raw Data',
          children: <PnlRawData />,
        },
        {
          key: 'pnl',
          label: 'PnL Dashboard',
          children: <PnlDashboard />,
        },
      ]}
    />
  );
};

export default PnlDashboardMain;

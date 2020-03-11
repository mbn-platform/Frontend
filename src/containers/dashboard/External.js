import React from 'react';
import BotList from './ApiBot';
import AddBotApi from './AddBotApi';

export const External = () => (
  <div className="dashboard_wrapper clearfix">
    <div className="keys_tables_wrapper table_wrapper">
      <BotList />
      <AddBotApi/>
    </div>
  </div>
);

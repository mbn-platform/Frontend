import React from 'react';
import BotList from './ApiBot';
import AddBotApi from './AddBotApi';

export class External extends React.Component {

  render() {
    return (
      <div className="dashboard_wrapper clearfix">
        <div className="keys_tables_wrapper table_wrapper">
          <BotList
            onKeySelected={this.onKeySelected}
          />
          <AddBotApi/>
        </div>
      </div>
    );
  }
}

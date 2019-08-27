import React from 'react';
import { Row, Col } from 'reactstrap';
import Calendar from 'react-calendar';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import DropdownSelect from '../../components/DropdownSelect';
import OutsideClick from '../../components/OutsideClick';

class Calculator extends React.Component {

  state = {
    isCalendarOpen: false,
    date: new Date('2019-01-01'),
    investment: '1000',
  }

  onDateChange = (date) => {
    this.setState({date, isCalendarOpen: false});
  }

  closeCalendar = () => this.setState({isCalendarOpen: false})

  onCalculateClick = () => {
    if (!this.props.trader) {
      return;
    }
    const investment = parseFloat(this.state.investment);
    if (!investment) {
      return;
    }
    this.props.calculateTraderProfit(this.props.trader, this.state.date.getTime(), investment);
  }

  componentDidUpdate() {
    if (!this.props.calculation && this.props.trader) {
      this.props.calculateTraderProfit(this.props.trader, this.state.date.getTime(), 1);
      return;
    }
    if (this.props.calculation) {
      const isSameTrader = this.props.trader === this.props.calculation.trader;
      const isSameDate = this.state.date.getTime() === this.props.calculation.start;
      const shouldUpdate = !isSameTrader || !isSameDate;
      if (this.props.trader && shouldUpdate) {
        this.props.calculateTraderProfit(this.props.trader, this.state.date.getTime(), 1);
      }
    }
  }

  onInvestmentChange = (e) => {
    const investment = e.target.value;
    const regex = /^\d*\.?\d*$/;
    if (regex.test(investment)) {
      this.setState({investment});
    }
  }

  renderSelectDate() {
    return (
      <span
        style={{
          color: '#3bbc94',
        }}
        onClick={() => this.setState({isCalendarOpen: true})}
      >
        {this.state.date.toLocaleDateString()}
        {this.renderCalendar()}
      </span>
    );
  }

  renderInvestButton(trader) {
    return (
      <Link to={'/' + trader}>
        <button 
          className="leaderboard__form-submit"
        >INVEST NOW
        </button>
      </Link>
    );
  }

  renderInvestmentInput() {
    return (
      <input className='investment'
        value={this.state.investment} onChange={this.onInvestmentChange} />
    );
  }

  render() {
    return (
      <Row className='calculator'>
        <Col xs="12" sm="6">
          <div className="title">
            <FormattedMessage
              id="leaderboard.calculator.title"
              defaultMessage="PROFIT CALCULATOR" />
          </div>
          <div className="param trader">1. Select a trader to calculate profit: {this.renderTraderName(this.props.trader)}</div>
          <div className="param">2. Set initial investment amount, USDT: {this.renderInvestmentInput()}</div>
          <div className="param">3. Set initial investment date: {this.renderSelectDate()}</div>
        </Col>
        <Col xs="12" sm="6">
          <div className='calculation'>
            {this.renderCalculationResult()}
          </div>
          <div className='undertext'>Profit is calculated according to trader's history verified by <Link to="/hashlog">Membrana Proof-of-Trade</Link></div>
        </Col>
      </Row>
    );
  }

  renderCalculationResult() {
    if (!this.props.calculation
      || this.props.calculation.trader !== this.props.trader) {
      return null;
    } else {
      const {trader, start, result} = this.props.calculation;
      const investment = parseFloat(this.state.investment);
      let resultBalance = 0;
      let percent = 0;
      if (investment > 0) {
        resultBalance = investment * result;
        percent = (resultBalance - investment) / investment * 100;
      }
      const percentValue = percent > 0 ? `+${percent.toFixed()}%`
        : `${percent.toFixed(2)}%`;
      return (
        <div>
          <div>This profit your could get by investing {this.state.investment} USDT to @{trader.toUpperCase()} at {new Date(start).toLocaleDateString()}.
            Today your balance would be:</div>
          <div className='profit'>{resultBalance.toFixed(2)} USDT {' '} {percentValue}</div>
          {this.renderInvestButton(this.props.calculation.trader)}
        </div>
      );
    }
  }

  renderTraderName(name) {
    if (!name) {
      return null;
    } else {
      return (
        <DropdownSelect
          filterable={true}
          selected={`@${name.toUpperCase()}`}
          targetId="trader_select"
          onItemSelect={this.props.onTraderSelect}
          dropdownClassName="trader_select"
          elementClassName="exchange__switch"
          className="trader_select"
          items={this.props.traders}
        />
      );
    }
  }

  formatName(name) {
    return name ? `@${name.toUpperCase()}` : '';
  }

  renderCalendar() {
    if (this.state.isCalendarOpen) {
      return (
        <OutsideClick
          onOutsideClick={this.closeCalendar}
        >
          <Calendar
            locale="en"
            className="calendar"
            maxDate={new Date()}
            onChange={this.onDateChange}
            onClickMonth={this.onDateChange}
            minDetail="year"
            value={this.state.date}
          />
        </OutsideClick>
      ); 
    } else {
      return null;
    }
  }
}

export default Calculator;

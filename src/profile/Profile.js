import React from 'react';
import ProfileChart from './ProfileChart';
import ProfileComments from './ProfileComments';


class Profile extends React.Component {

  constructor(props) {
    super(props);
    console.log('constructor');
    this.onChange = this.onChange.bind(this);
    this.state = {fee: '', 'min-amount': ''};
  }

  initialState() {
    return {
      fee: '',
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }



  onChange(e) {
    const value = e.target.value;
    this.setState({[e.target.name]: value});
  }
  render() {
    return (
      <div>
        <h2>General</h2>
        <div>Nickname</div>
        <div>Trader Rating</div>
        <div>Ivestor rating</div>
        <div>Status</div>
        <div>Amount</div>
        <ProfileComments />
        <ProfileChart />
        <h2>Detail</h2>
        <form onSubmit={this.onSubmit}>
          Fee
          <input name="fee" onChange={this.onChange} value={this.state.fee} />
          Min contract amount
          <input name="min-amount" onChange={this.onChange} value={this.state['min-amount']} />
        </form>

      </div>
    );
  }



}

export default Profile;

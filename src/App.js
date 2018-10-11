import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import {apiGet, ApiError} from './generic/apiCall';
import {loggedIn, loggedOut} from './actions/auth';
import { Provider } from 'react-redux';
import MainContent from './MainContentContainer';
import Navigation from './Navigation';
import { fetchTime } from './actions/time';
import { Container, Row } from 'reactstrap';
import createMqProvider, {querySchema} from './MediaQuery';
import './App.css';
import $ from 'jquery';
window.jQuery = window.$ = $;
require('floatthead');
require('bootstrap');
require('malihu-custom-scrollbar-plugin');

const {MediaQuery} = createMqProvider(querySchema);

window.customize = function() {
  /*
    Ratings: ROI chart period selectbox
    */

  var mobileScreenShowButton = ($group, $item, countItem, textMore, textLess,heightEle) => {
    let heightList = 0;
    $item.each(function(i,el) {
      if(i.toString() === countItem.toString()) {
        return false;
      } else {
        heightList += heightEle || $(this).height();
      }
    });
    if(!($item.length <= countItem)) {
      $group.height(heightList);
    }
  };

  $(window).resize((e) => {
    if($(window).width() > 1020){


      $('.feedback-card .card-body .list-group').height($('.feedback-card .card-body').outerHeight() - 50);
      $('.feedback-card .card-body .list-group').mCustomScrollbar({
        scrollButtons:{
          enable:false
        },
        mouseWheel:{ preventDefault: true },
        scrollbarPosition: 'outside',
        autoExpandScrollbar:true,
        theme: 'dark'
      });
    }else{
      $('.feedback-card .card-body .list-group').mCustomScrollbar('destroy');
      mobileScreenShowButton($('.feedback-card .card-body .list-group'),$('.feedback-card .card-body .list-group .list-group-item'), 5,'show next 5 feedbacks','show less 5 feedbacks');

    }
  }).trigger('resize');
};


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {loading: true};
  }

  componentDidMount() {
    window.addEventListener('load', () => {
      if(typeof window.web3 !== 'undefined') {
        window.web3 = new window.Web3(window.web3.currentProvider);
      }
      if(store.getState().auth.loggedIn) {
        apiGet('/profile')
          .then(({profile}) => {
            store.dispatch(loggedIn(profile));
          })
          .catch(err => {
            if(err.apiErrorCode && err.apiErrorCode === ApiError.FORBIDDEN) {
              store.dispatch(loggedOut());
            }
          })
          .then(() => {
            this.setState({loading: false});
          });
      } else {
        this.setState({loading: false});
      }
    });
    store.dispatch(fetchTime());
    this.timeInterval = setInterval(() => {
      store.dispatch(fetchTime());
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
  }

  render() {
    return (
      <Provider store={store}>
        {this.state.loading ? <div/> : (<MainRouter />)}
      </Provider>
    );
  }
}

const MainRouter = () => (
  <BrowserRouter>
    <MediaQuery>
      <Container className="main-panel" fluid>
        <Row noGutters className='flex-wrap flex-md-nowrap'>
          <Navigation />
          <MainContent />
        </Row>
      </Container>
    </MediaQuery>
  </BrowserRouter>
);

export default App;

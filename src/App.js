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
import './App.css';
import $ from 'jquery';
window.jQuery = window.$ = $;
require('floatthead');
require('bootstrap');
require('malihu-custom-scrollbar-plugin');

window.uncustomize = function() {
  $(document).off('click');
};
window.customize = function() {

  /*
    Global: Sticky table headers
    */
  let processScrollableTable = function($table) {
    $table.on('reflowed', function(e, $floatContainer) {
      let headHeight = $('tr', this).first().height();

      $floatContainer.parent('.floatThead-wrapper').css({'padding-top': headHeight});
      $(this).css('margin-top', -headHeight);
    });
    $table.floatThead({
      scrollContainer: function($table){
        let $container = $table.parents('.js-table-wrapper');
        if (!$container.length) {
          $container = $table.parents('.js-dropdown-table-wrapper');
        }

        return $container;
      },
      position: 'absolute',
      autoReflow: 'true',
      width: '100px',
      debug: true
    });
  };
  $('.js-table-wrapper table').each(function(index, el) {
    let $table = $(el);
    processScrollableTable($table);
  });

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
      $('.feedback-card .card-body .list-group .mCSB_draggerContainer').height($('.feedback-card .card-body').outerHeight() + 50);

      $('input[type="text"]').focus(function(){
        $(this).data('placeholder',$(this).attr('placeholder'))
          .attr('placeholder','');
      }).blur(function(){
        $(this).attr('placeholder',$(this).data('placeholder'));
      });
    }else{
      //$(selector).mCustomScrollbar("destroy"); //destroy scrollbar
      $('.feedback-card .card-body .list-group').mCustomScrollbar('destroy');
      mobileScreenShowButton($('.feedback-card .card-body .list-group'),$('.feedback-card .card-body .list-group .list-group-item'), 5,'show next 5 feedbacks','show less 5 feedbacks');

    }
  }).trigger('resize');



  $(document).on('click', function(e) {
    if (!$(e.target).closest('.all-time').length && !$(e.target).closest('.all-time_dropdown').length) {
      $('.all-time').popover('hide');
    }

    if (!$(e.target).closest('.dropdown').length && !$(e.target).closest('.dropdown-link').length) {
      $('.dropdown-link').popover('hide');
    }
  });
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
    <Container className="main-panel" fluid>
      <Row noGutters className='flex-wrap flex-md-nowrap'>
        <Navigation />
        <MainContent />
      </Row>
    </Container>
  </BrowserRouter>
);





export default App;

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import { Provider } from 'react-redux';
import MainContent from './MainContentContainer';
import Navigation from './Navigation';
import { fetchTime } from './actions/time';
import { Container, Row } from 'reactstrap';
import './App.css';
import $ from 'jquery';
window.jQuery = window.$ = $;
window.Tether = require('tether');
window.Popper = require('popper.js');
require('floatthead');
require('bootstrap');
require('readmore-js');
require('malihu-custom-scrollbar-plugin');

window.uncustomize = function() {
  $(document).off('click');
}
window.customize = function() {
  console.log('component did mount');
  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="popover"]').popover();

  /*
    Global: Sticky table headers
    */
  let processScrollableTable = function($table) {
    $table.on('reflowed', function(e, $floatContainer) {
      let headHeight = $('tr', this).first().height();

      $floatContainer.parent('.floatThead-wrapper').css('padding-top', headHeight);
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
      // debug: true
    });
  };

  $('.js-table-wrapper table').each(function(index, el) {
    let $table = $(el);

    processScrollableTable($table);
  });


  /*
    Global: Dropdowns behavior
    */



  /*
    Ratings: 'Rank legend' popover
    */
  $('[data-toggle="ratings-help-popover"]').popover({
    trigger: 'hover',
    container: $('.ratings-main'),
    html: true,
    animation: false,
    template: `
      <div class="popover help-popover">
        <div class="arrow"></div>
        <div class="popover-body"></div>
      </div>`,
    content: function() {
      let total   = $(this).data('total');
      let success = $(this).data('success');
      let investors = $('.ratings-investors.active').length ? ' success-investors' : '';

      return `
        <div class="total row">
          <div><span class="round"></span></div>
          <div><span>${total}</span></div>
        </div>
        <div class="success row${investors}">
          <div><span class="round"></span></div>
          <div><span>${success}</span></div>
        </div>`;
    }
  });


  /*
    Ratings: ROI chart period selectbox
    */
  $('.all-time').popover({
    trigger: 'click',
    container: $('.ratings-main'),
    html: true,
    animation: false,
    placement: 'bottom',
    template: `
      <div class="popover dropdown-popover dropdown-popover--select">
        <div class="popover-body"></div>
      </div>`,
    content: function() {
      return $(this).next('.all-time_dropdown')[0].outerHTML;
    },
    offset: '50%p - ' + (($('.all-time').width() / 2) + 8).toString() + 'px, 0'
  });


  $('.icon-fullscreen').each(function() {
    $(this).click(function() {
      let element = $(this).parent().parent().parent().parent().parent().get(0);
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
      else if(element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
      else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      }
      else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      }
    });
  });

  function editGroupEnable() {
    if($('#cmn-toggle-4').prop('checked')) {
      $('.info-screen').addClass('edit-block');
      $('.edit-btn').addClass('active');
      $('.edit-btn').text('save changes');
    } else {
      $('.info-screen').removeClass('edit-block');
      $('.edit-btn').removeClass('active');
      $('.edit-btn').text('edit');
    }
    console.log($('.info-screen').hasClass('disable-block'));
    if($('.info-screen').hasClass('disable-block')) {
      $('.duration-contract .form-control').prop('disabled',true);
      $('#cmn-toggle-4').prop('disabled',true);

    }
  }
  editGroupEnable();
  $( '#cmn-toggle-4' ).on( 'click', editGroupEnable );

  var mobileScreenShowButton = ($group, $item, countItem, textMore, textLess,heightEle) => {
    let heightList = 0;
    $item.each(function(i,el) {
      if(i == countItem) {
        return false;
      } else {
        heightList += heightEle || $(this).height();
      }
    });
    $group.readmore('destroy');
    if($item.length > countItem) {

      //$(".feedback-card .card-body .list-group").height(heightList)
      let countClickedMore = 0;
      /*if($(".feedback-card .card-body .list-group .list-group-item").length > 10) {
        $(".feedback-card .card-body .list-group .list-group-item").each(function(i,el) {
          if(i > 9) {
            $(this).css("display", "none")
          }
        })
      }*/
      $group.readmore({
        collapsedHeight:heightList,
        speed: 500,
        moreLink: '<div class="d-flex justify-content-center show-feedbacks-block"><button type="button" class="show-feedbacks-btn btn btn-secondary">' + textMore + '</button></div>',
        lessLink: '<div class="d-flex justify-content-center show-feedbacks-block"><button type="button" class="show-feedbacks-btn btn btn-secondary">' + textLess + '</button></div>',
        afterToggle: function(trigger, element, expanded) {
          if(! expanded) {
            //$(".feedback-card .card-body .list-group").readmore('toggle');
          }
        }
      });
    } else {
      $group.height(heightList);
    }
  };

  $(window).resize((e) => {
    if($(window).width() > 1020){

      $('article').readmore({
        collapsedHeight:68,
        speed: 500,
        moreLink: '<a href="#">Read more >></a>',
        lessLink: '<a href="#">Read less <<</a>'
      });
      $('.currency-settings tbody').height($('.currency-settings .card-body').outerHeight() - $('.currency-settings thead th').outerHeight());

      $('.currency-settings tbody').mCustomScrollbar({
        theme:'light-3',
        scrollButtons:{
          enable:false
        },
        setHeight: ($('.currency-settings .card-body').outerHeight() - $('.currency-settings thead th').outerHeight()),
        mouseWheel:{ preventDefault: true },
        scrollbarPosition: 'inside',
        autoExpandScrollbar:true,
        theme: 'dark'
      });
      $('.trade-history tbody').height($('.trade-history .card-body').outerHeight() - $('.trade-history thead th').outerHeight());
      $('.trade-history tbody').mCustomScrollbar({
        theme:'light-3',
        scrollButtons:{
          enable:false
        },
        setHeight: ($('.trade-history .card-body').outerHeight() - $('.trade-history thead th').outerHeight()),
        mouseWheel:{ preventDefault: true },
        scrollbarPosition: 'inside',
        autoExpandScrollbar:true,
        theme: 'dark'
      });

      $('.feedback-card .card-body .list-group').height($('.feedback-card .card-body').outerHeight() - 50);
      $('.feedback-card .card-body .list-group').mCustomScrollbar({
        theme:'light-3',
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
      console.log($('.currency-settings .card-body').outerHeight(), $('.currency-settings thead th').outerHeight()); //apply scrollbar with your options
    }else{
      //$(selector).mCustomScrollbar("destroy"); //destroy scrollbar
      $('article').readmore('destroy');
      $('.currency-settings tbody').mCustomScrollbar('destroy');
      $('.trade-history tbody').mCustomScrollbar('destroy');

      $('.feedback-card .card-body .list-group').mCustomScrollbar('destroy');

      /*let heightList = 0;
      $(".feedback-card .card-body .list-group .list-group-item").each(function(i,el) {
        if(i == 5) {
          return false
        } else {
          heightList += $(this).height()
        }
      })
      if($(".feedback-card .card-body .list-group .list-group-item").length > 5) {

    //$(".feedback-card .card-body .list-group").height(heightList)
        let countClickedMore = 0;
        $(".feedback-card .card-body .list-group").readmore({
          collapsedHeight:heightList,
          speed: 500,
          moreLink: '<div class="d-flex justify-content-center show-feedbacks-block"><button type="button" class="show-feedbacks-btn btn btn-secondary">show next 5 feedbacks</button></div>',
          lessLink: '<div class="d-flex justify-content-center show-feedbacks-block"><button type="button" class="show-feedbacks-btn btn btn-secondary">show less 5 feedbacks</button></div>',
          afterToggle: function(trigger, element, expanded) {
            if(! expanded) {
    //$(".feedback-card .card-body .list-group").readmore('toggle');
            }
          }
        });
      } else {
        $(".feedback-card .card-body .list-group").height(heightList)
      }*/
    mobileScreenShowButton($('.feedback-card .card-body .list-group'),$('.feedback-card .card-body .list-group .list-group-item'), 5,'show next 5 feedbacks','show less 5 feedbacks');
    //mobileScreenShowButton($(".currency-settings table tbody"),$(".currency-settings tbody tr") ,10 ,'show next 10 currencies' ,'show previous 10 currencies',$(".currency-settings tbody tr:not(.empty-tr) td").outerHeight())



  }
  }).trigger('resize');

  $('.ratings-main__block').find('.block__top-switch').on('click', function(e) {
    e.preventDefault();
    var container = $('.ratings-main__block'),
      tabs = container.find('.ratings-tabs'),
      tabOpen = tabs.find('.ratings-traders '),
      tabCompl = tabs.find('.ratings-investors');

    if($(this).hasClass('ratings-traders')){
      $(this).addClass('active')
        .siblings().removeClass('active');
      tabOpen.addClass('active')
        .siblings().removeClass('active');
    }
    else if ($(this).hasClass('ratings-investors')){
      $(this).addClass('active')
        .siblings().removeClass('active');
      tabCompl.addClass('active')
        .siblings().removeClass('active');
    }

    $('.js-table-wrapper table').floatThead('reflow');
  });

  $(document).on('click', function(e) {
    console.log('document on click');
    if (!$(e.target).closest('.all-time').length && !$(e.target).closest('.all-time_dropdown').length) {
      $('.all-time').popover('hide');
    }

    if (!$(e.target).closest('.dropdown').length && !$(e.target).closest('.dropdown-link').length) {
      $('.dropdown-link').popover('hide');
    }
  });
}


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
      this.setState({loading: false});
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
      <Row noGutters>
        <Navigation />
        <MainContent />
      </Row>
    </Container>
  </BrowserRouter>
);





export default App;

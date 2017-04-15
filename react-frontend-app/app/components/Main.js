var React = require('react'),
    PropTypes = React.PropTypes,
    ReactCssTransitionGroup = require('react-addons-css-transition-group'),
    BackgroundPic = require('../assets/img/bg_01.jpg'),
    ReactRedux = require("react-redux"),
    actions = require('../redux/actions/authActions'),
    GameNavbar = require('./Game/GameNavbar'),
    ChallengeNotificationMenu = require('./Game/Dashboard/ChallengeNotification');;

require('../main.css');;
require('../styles/layout.css');
require('../styles/components.css');
require('../styles/animate.css');

var Main = React.createClass({
  handleLogout() {
    this.props.logoutUser();
    window.location.href = "/";
  },
  propTypes:{
        logoutUser: PropTypes.func.isRequired
    },
  render: function () {
    return (
      <div>
        {this.props.User.authenticated ? 
        <div>
          <GameNavbar logoutUser={this.handleLogout}/>
          <ChallengeNotificationMenu />
        </div>
        
        : ""
        }
        <div className='main-container'>
          {<ReactCssTransitionGroup
            transitionName="appear"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}>
              {React.cloneElement(this.props.children, {key: this.props.location.pathname})}
          </ReactCssTransitionGroup>}
        </div>
      </div>
    )
  }
});

var styles = {
  imageBackground: {
    background: '#2f373e url('+BackgroundPic+') no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed'
  }
}

// connect to Redux store
var mapStateToProps = function(state){
    // This component will have access to `appstate.heroes` through `this.props.heroes`
    return {User: state.user};
};
var mapDispatchToProps = function(dispatch){
    return {
        logoutUser: function(){ dispatch(actions.logoutUser()); }
    }
};
module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Main);
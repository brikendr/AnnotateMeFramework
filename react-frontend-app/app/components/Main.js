var React = require('react');
var ReactCssTransitionGroup = require('react-addons-css-transition-group');
var BackgroundPic = require('../assets/img/bg_01.jpg');

require('../main.css');;
require('../styles/layout.css');
require('../styles/components.css');

var Main = React.createClass({
  render: function () {
    return (
      <div className='main-container'>
        {<ReactCssTransitionGroup
          transitionName="appear"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
            {React.cloneElement(this.props.children, {key: this.props.location.pathname})}
        </ReactCssTransitionGroup>}
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
module.exports = Main;
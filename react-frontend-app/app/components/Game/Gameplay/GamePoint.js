var React = require('react'),
    PropTypes = React.PropTypes
    assetsDir = require('../../../utils/constatns').assets;

var GamePoint = React.createClass({
    getInitialState: function() {
        return {
            pointAnimation: "animated slideInUp",
            shouldShow: true
        }
    },
    componentDidMount() {
        require('../../../styles/neonShine.css');
        
		this.playAudio();
        setTimeout(function() {
            console.log('animating down');
            this.setState({pointAnimation: "animated zoomOut"});
            
            this.destroyElement();
        }.bind(this), 2000);
    },
    playAudio () {
        var audio = document.getElementById("sound-3");		
        audio.play();
    },
    destroyElement() {
        setTimeout(function() {
            this.setState({shouldShow: false});
        }.bind(this), 1000);
    },
    render(){
        var element = this.state.shouldShow ?         
        <div className={'center ' + this.state.pointAnimation}>
            <button className='shinyBtn shinyBtn-glow'>{this.props.point} points!</button>
            <audio src={assetsDir+"/audio/levelup.wav"} id="sound-3"></audio>
        </div>
        : "";
        return ( 
            <div>
                {element}
            </div>
            );
    }
});
var styles = {
    bottomCenter: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    }
}
GamePoint.PropTypes = {
    point: PropTypes.number.isRequired
}

module.exports = GamePoint;

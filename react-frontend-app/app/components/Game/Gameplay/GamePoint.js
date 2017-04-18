var React = require('react'),
    PropTypes = React.PropTypes,
    ReactRedux = require("react-redux"),
    assetsDir = require('../../../utils/constatns').assets,
    registerPoint = require('../../../utils/GameHelper').registerPoint,
    gameActions = require('../../../redux/actions/utilActions').setPlayerScore;

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
        //Update Player Score 
        this.props.setPlayerScore(this.props.point);

        //Update Score in db 
        var PlayerInfo = this.props.PlayerStats.Player;
        registerPoint(PlayerInfo.points, PlayerInfo.id).
            then(function(response) {
                setTimeout(function() {
                    console.log('animating down');
                    this.setState({pointAnimation: "animated zoomOut"});
                    
                    this.destroyElement();
                }.bind(this), 2000);
            }.bind(this));
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
            <button className='shinyBtn shinyBtn-glow'>+ {this.props.point} points!</button>
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
    point: PropTypes.number.isRequired,
    User: PropTypes.object.isRequired,
    PlayerStats: PropTypes.object.isRequired,
    setPlayerScore: PropTypes.func.isRequired
}

// connect to Redux store
var mapStateToProps = function(state){
    // This component will have access User object of the redux state.
    return {User: state.user, PlayerStats: state.game.playerStats.stats};
};
var mapDispatchToProps = function(dispatch){
    return {
        setPlayerScore: function(jsonData){ dispatch(gameActions(jsonData)); }
    }
};
module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(GamePoint);

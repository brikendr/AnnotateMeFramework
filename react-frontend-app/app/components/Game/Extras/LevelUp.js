var React = require('react'),
    PropTypes = React.PropTypes
    assetsDir = require('../../../utils/constatns').assets;

var LevelUp = React.createClass({
    getInitialState: function() {
        return {
            pointAnimation: "animated slideInUp",
            shouldShow: true
        }
    },
    componentDidMount() {
        require('../../../styles/levelUp.css');
        require('../../../styles/modalStyle.css');
        //var $ = require('jquery');
        
		this.playAudio();
        this.jqueryAnimate();
        setTimeout(function() {
            console.log('animating down');
            this.setState({pointAnimation: "animated zoomOut"});
            
            this.destroyElement();
        }.bind(this), 5000);

    },
    jqueryAnimate(){
        $('.progress').animate({
            width: "98%"
        }, 2000, function() {
            $('.target-lvl').addClass('lvl-animate');
            $('#initial-lvl').fadeOut('3000');
            $('.line').fadeOut('3000');
        });
        $('.cur-xp').each(function() {
            $(this).prop('Counter', 500).animate({
            Counter: 8000
            }, {
            duration: 3000,
            easing: 'swing',
            step: function(now) {
                $(this).text(Math.ceil(now));
            }
            });
        });
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
        <div className="modal-wrapper open">
            <audio src={assetsDir+"/audio/Winning-sound-effect-piano.mp3"} id="sound-3"></audio>
            <div className="modal">
                <div className="head">
                    <h3 className="bold font-white">Level Up! (Level Name)</h3>
                    </div>
                <div className="content">
                    
                        <p>Congratulations! You’ve earned enough Points to reach a new level.</p>
                        <div id="initial-lvl" className="num-circle">
                            <span>1</span>
                        </div>
                        <div className="line">
                            <div className="progress"></div>
                            <span className="cur-xp">1500</span><span className="xp"> CC</span>
                        </div>
                        <div className="num-circle target-lvl">
                            10
                        </div>
                        <div className="clear"></div>
                </div>
            </div>
            <a href="javascript:;" className="btn btn-lg red"> Red</a>
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
/*LevelUp.PropTypes = {
    point: PropTypes.number.isRequired,
    currentLevel: PropTypes.string.isRequired,
    nextLevel: PropTypes.string.isRequired,
    startValue: PropTypes.number.isRequired,
    finishValue: PropTypes.number.isRequired
}*/

module.exports = LevelUp;

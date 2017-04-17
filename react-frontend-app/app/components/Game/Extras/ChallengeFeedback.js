var React = require('react'),
    PropTypes = React.PropTypes,
    assetsDir = require('../../../utils/constatns').assets;

var ChallengeFeedback = React.createClass({
    getInitialState: function() {
        return {
            animation: "animated zoomIn",
            borderColor: ""
        }
    },
    componentDidMount() {
        var soundId = "";
        switch (this.props.challengeStatus) {
            case 1: {
                this.setState({animation: "animated bounce", borderColor: "border-green-jungle"}); soundId = "challenge_won";break;
            }
            case 2: {
                this.setState({animation: "animated shake", borderColor: "border-red-mint"}); soundId = "challenge_lost";break;
            }
            case 3: {
                this.setState({animation: "animated jello", borderColor: "border-grey-cascade"}); soundId = "challenge_draw";break;
            }
        }
        this.playAudio(soundId);
        document.addEventListener("keydown", this.commandListener);
    },
    commandListener(e) {
        if (e.ctrlKey && e.keyCode == 67) {
            this.destroyListener();
        }
    },
    destroyListener() {
        document.removeEventListener("keydown", this.commandListener);
        setTimeout(function(){
            this.props.onGameStateChange("FINISH_CHALLENGE");
        }.bind(this), 1000);
    },
    playAudio(soundID) {
        var audio = document.getElementById(soundID);		
        audio.play();
    },
    render() {
        var message = "",
            pointStatus = "";
        switch (this.props.challengeStatus) {
            case 1: {
                message = "Awesome " + this.props.challengee + "! Opponent Distroyed!";
                pointStatus = "Won";break;
            }
            case 2: {
                message = "Damn " + this.props.challengee + "! You LOST!";
                pointStatus = "Lost";break;

            }
            case 3: {
                message = "What a Game! It's a DRAW!";
                pointStatus = "Shared";break;

            }
        }

        return (
            <div className="col-md-12">
                <div className="row justify-content-center marginTop5 ">
                    <div className="col-md-12">
                        <div className="mt-widget-1" style={{border: 'none'}}>
                            <div className={"mt-img " + this.state.borderColor + " " + this.state.animation} style={{margin: '5px'}}>
                                <img src={assetsDir + "img/game-avatar.png"} width="60px"/> 
                            </div>
                            <div className="mt-body">
                                <h5>{message}</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="stats stats--main font-green-haze">
                            <div className="stats__caption">Points {pointStatus}:</div>
                            <div className="stats__amount">{this.props.challengedPoints}</div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-actions">
                            <div className="row justify-content-center">
                                <div className="col-md-6">
                                    <p className="text-display">CTRL + C</p>
                                    <h5>Use Command to Exit</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <audio src={assetsDir+"/audio/Shofar-sound.mp3"} id="challenge_draw"></audio>
                    <audio src={assetsDir+"/audio/Transition-sound.mp3"} id="challenge_lost"></audio>
                    <audio src={assetsDir+"/audio/Funk-riff.mp3"} id="challenge_won"></audio> 
                </div>
            </div>
        );
    }
})

ChallengeFeedback.propTypes = {
    onGameStateChange: PropTypes.func.isRequired,
    challengee: PropTypes.string.isRequired,
    challengeStatus: PropTypes.number.isRequired,
    challengedPoints: PropTypes.number.isRequired
};

module.exports = ChallengeFeedback;
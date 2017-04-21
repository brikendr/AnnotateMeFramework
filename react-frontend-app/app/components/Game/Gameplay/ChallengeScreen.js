var React = require('react'),
    PropTypes = React.PropTypes,
    assets = require('../../../utils/constatns').assets,
    GameHelper = require('../../../utils/GameHelper'),
    Challengers = require('./Challengers'),
    SpaceBtn = require('../../../components/Game/SpaceActionBtn');

var ChallengeScreen = React.createClass({
    getInitialState: function() {
        return {
            mappedChallengers: [],
            selectedChallengers: [],
            animation: "",
            challengedPoints: 10
        }
    },
    componentDidMount() {
        document.body.addEventListener("keydown", this.handleCandidateSelection);
        this.loadDependencies();
        //fetch possible challengers 
        GameHelper.fetchPossibleChallengers(this.props.Player.id, this.props.wpm)
            .then(function(possibleChallengers) {
                this.mapChallengers(possibleChallengers.resource);
            }.bind(this));
    },
    loadDependencies() {
        require('../../../styles/playerStats.css');
        require('../../../styles/slider.css');
    },
    mapChallengers(challengers) {
        var i = 1;
        const mappedChallengers = challengers.map(challenger => 
            <Challengers key={challenger.id} name={challenger.Player.username} wpm={challenger.current_wps} number={i++} challengerId={challenger.Player.id} toggleChallengerFromList={this.toggleChallengerFromList} />               
        );
        this.setState({mappedChallengers: mappedChallengers});
    },
    toggleChallengerFromList(challengerId, wpm) {
        var selectedChallengers = this.state.selectedChallengers;
            idx = selectedChallengers.map(function(e) { return e.challengerId; }).indexOf(challengerId);
        if(idx > -1) {
            selectedChallengers.splice(idx, 1);

        } else {
            selectedChallengers.push({'challengerId': challengerId, 'wpm': wpm});
        }
        this.setState({selectedChallengers: selectedChallengers});
    },
    handleCandidateSelection(e){
        var val = this.state.challengedPoints;
        if (e.keyCode == 37) {
            //left ARROW
            if(val > 10){
                this.setState({challengedPoints: (val - 10)});
            }
            this.playAudio("sound-3");                
        } 
        else if (e.keyCode == 39) {
            //right arrow
            if(val < 100){
                this.setState({challengedPoints: (val + 10)});
            }
            this.playAudio("sound-3");
        } 
        else if (e.ctrlKey && e.keyCode == 32) {
            //TODO save Challenge and go to home page
            this.props.challengePlayers(this.state.selectedChallengers, (this.state.challengedPoints / 10));
            this.unbindListeners();
        }
    },
    unbindListeners() {
        document.body.removeEventListener("keydown", this.handleCandidateSelection);
        setTimeout(function () {
            this.props.onGameStateChange("COMPLETED");
        }.bind(this), 1000);
    },
    playAudio(soundID) {
        var audio = document.getElementById(soundID);		
        audio.play();
    },
    render() {
        return (
            <div className="col-md-12">
                <div className="row justify-content-center marginTop5 animated zoomIn">
                    <div className="col-md-6">
                        <div className="portlet light">
                            <div className="portlet-title bg-green-haze bg-font-green-haze" style={styles.portletTitle}>
                                <p className="caption bold uppercase font-white" style={{float: 'inherit'}}> Challenge Time! </p>
                            </div>
                            <div className="portlet-body">
                                <div className="box" style={{background: 'none', width: '100%'}}>
                                    <div className="box__body">

                                        <div className="stats stats--main font-green-haze">
                                            <div className="stats__caption">(Your) Challenging Speed</div>
                                            <div className="stats__amount">{this.props.wpm} <small>wpm</small></div>
                                        </div>

                                        <div className="stats stats--main font-green-haze">
                                            <div className="stats__caption">How many points?</div>
                                            <div className="stats__amount">
                                                <audio src="https://s3.amazonaws.com/freecodecamp/simonSound4.mp3" id="sound-3"></audio>
                                                <form>
                                                    <input type="range" value={this.state.challengedPoints}/>
                                                    <h5 className="bold uppercase">{this.state.challengedPoints / 10 + (this.state.challengedPoints > 10 ? " Points":" Point")} </h5>
                                                </form>
                                            </div>
                                            <h4 className="font-dark">Use Left - Right arrow to change value</h4>
                                        </div>

                                        <div className="stats stats--main font-green-haze">
                                            <div className="stats__caption">Potential Challengers</div>
                                            <div className="stats__amount">
                                                <div className={"row justify-content-center "}  >
                                                    <div className="col-10 text-center">
                                                        <div className="clearfix">
                                                            <div className="row justify-content-center">
                                                                {this.state.mappedChallengers}
                                                            </div>
                                                        </div>
                                                        <h4 className="font-dark">Use numbers to select challenger</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <SpaceBtn command="CTRL + SPACE" message="Complete Challenge" divSize={12}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        );
    }
});
ChallengeScreen.propTypes = {
    onGameStateChange: PropTypes.func.isRequired,
    wpm: PropTypes.number.isRequired,
    challengePlayers: PropTypes.func.isRequired,
    Player: PropTypes.object.isRequired
};
var styles = {
    portletTitle: {
        textAlign: 'center',
        margin: 'auto',
        float: 'inherit'
    }
    
}
module.exports = ChallengeScreen;
var React = require('react'),
    PropTypes = React.PropTypes,
    assets = require('../../../utils/constatns').assets,
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
    },
    loadDependencies() {
        require('../../../styles/playerStats.css');
        require('../../../styles/slider.css');
    },
    toggleChallengerFromList(challengerNr) {
        var selectedChallengers = this.state.selectedChallengers;
            idx = selectedChallengers.indexOf(challengerNr);
        if(selectedChallengers[challengerNr] != null) {
            selectedChallengers.splice(idx, 1);

        } else {
            selectedChallengers[challengerNr] = challengerNr;
        }
        this.setState({selectedChallengers: selectedChallengers});
        console.log(selectedChallengers);
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
            this.props.challengePlayers(this.state.selectedChallengers);
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
                                            <div className="stats__caption">Challenging Speed</div>
                                            <div className="stats__amount">{this.props.wpm} <small>wpm</small></div>
                                        </div>

                                        <div className="stats stats--main font-green-haze">
                                            <div className="stats__caption">Game Category</div>
                                            <div className="stats__amount">Arts</div>
                                        </div>

                                        <div className="stats stats--main font-green-haze">
                                            <div className="stats__caption">Accumulated Points</div>
                                            <div className="stats__amount">
                                                <audio src="https://s3.amazonaws.com/freecodecamp/simonSound4.mp3" id="sound-3"></audio>
                                                <form>
                                                    <input type="range" value={this.state.challengedPoints}/>
                                                    <h5 className="bold uppercase">{this.state.challengedPoints / 10 + (this.state.challengedPoints > 10 ? " Points":" Point")} </h5>
                                                </form>
                                            </div>
                                            <h5>Use Left - Right arrow to change value</h5>
                                        </div>

                                        <div className="stats stats--main font-green-haze">
                                            <div className="stats__caption">Potential Challengers</div>
                                            <div className="stats__amount">
                                                <div className={"row justify-content-center "}  >
                                                    <div className="col-10 text-center">
                                                        <div className="clearfix">
                                                            <div className="row justify-content-center">
                                                                <Challengers   name="Brikend Rama"
                                                                    wpm={34}
                                                                    number={1} 
                                                                    toggleChallengerFromList={this.toggleChallengerFromList}
                                                                    />
                                                                <Challengers   name="Ardit Dika"
                                                                    wpm={28}
                                                                    number={2}
                                                                    toggleChallengerFromList={this.toggleChallengerFromList}
                                                                    />
                                                                <Challengers   name="Bjorn Hermansen"
                                                                    wpm={38}
                                                                    number={3} 
                                                                    toggleChallengerFromList={this.toggleChallengerFromList}
                                                                    />
                                                                <Challengers   name="Sondre Trydal"
                                                                    wpm={57}
                                                                    number={4}
                                                                    toggleChallengerFromList={this.toggleChallengerFromList} 
                                                                    />
                                                            </div>
                                                        </div>
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
    challengePlayers: PropTypes.func.isRequired
};
var styles = {
    portletTitle: {
        textAlign: 'center',
        margin: 'auto',
        float: 'inherit'
    }
    
}
module.exports = ChallengeScreen;
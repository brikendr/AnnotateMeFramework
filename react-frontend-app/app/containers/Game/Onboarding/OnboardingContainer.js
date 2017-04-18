var React = require('react');
require('../../../styles/animate.css');
var IntroScreen = require('../../../components/Game/Onboarding/IntroScreen');
var WaveScreen = require('../../../components/Game/Onboarding/WaveScreen');
var PuzzleIntro = require('../../../components/Game/Onboarding/PuzzleIntro');
var EntityRevealScreen = require('../../../components/Game/Onboarding/EntityRevealScreen');
var RewardScreen = require('../../../components/Game/Onboarding/RewardScreen');

var OnBoardingContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            screenNr: 1,
            currentScreen: <IntroScreen onSpaceClick={this.handleSpaceClick} />,
            wave1Words: [
                "this",
                "hello",
                "type",
                "fast"
            ],
            wave2Words: [
                "known",
                "teen",
                "idol"
            ],
            hasFinishedRound: false,
            screenOneState: 1,
            screenTwoState: 1,
            playerWpm: 0
        }
    },
    handleChangeScreen(newScreenNr, nextScreen,hasFinished) {
        this.setState({
            screenNr: newScreenNr,
            nextScreen: nextScreen,
            hasFinishedRound: hasFinished == null ? true:hasFinished
        })
    },
    setPlayerStats(statsObj) {
        var playerWpm = this.state.playerWpm,
            newWpm = 0;
        if(playerWpm == 0) {
            newWpm = statsObj.wpm;
        } else {
            newWpm = (playerWpm + statsObj.wpm) / 2; //average from two typing sessions
        }
        this.setState({playerWpm: newWpm})
    },
    handleSpaceClick(e) {
        var scNr = this.state.screenNr;
        if(e.keyCode == 32 && (this.state.hasFinishedRound || scNr == 1)) {
            if(scNr == 1 && [1, 2, 3].indexOf(this.state.screenOneState) != -1) {
                var screenOneNext = this.state.hasFinishedRound ? this.state.screenOneState + 1:this.state.screenOneState;
                var finishedRoundOne = this.state.screenOneState == 2 ? false:true;
                this.setState({
                    screenNr: 1,
                    screenOneState: screenOneNext,
                    hasFinishedRound: finishedRoundOne,
                    currentScreen: <WaveScreen words={this.state.wave1Words} onFinishWave={this.handleSpaceClick} changeScreenNr={this.handleChangeScreen} setPlayerStats={this.setPlayerStats} />
                });
            }
            else if(this.state.screenOneState == 4 && this.state.screenTwoState == 1) {
                var scrTwoState = this.state.screenTwoState + 1;
                this.setState({
                    screenNr: 3,
                    screenTwoState: scrTwoState,
                    hasFinishedRound: true,
                    currentScreen: <PuzzleIntro onSpaceActionBtn={this.handleSpaceClick} />
                });
            } else if (scNr == 3) {
                this.setState({
                    screenNr: 3,
                    hasFinishedRound: false,
                    currentScreen: <EntityRevealScreen words={this.state.wave2Words} onFinishWave={this.handleSpaceClick} changeScreenNr={this.handleChangeScreen} setPlayerStats={this.setPlayerStats}/>
                });
            } else if(scNr == 4) {
                this.setState({
                        hasFinishedRound: false,
                        currentScreen: <RewardScreen onFinishWave={this.handleSpaceClick} redirectHome={this.handleRedirectHome} playerWpm={this.state.playerWpm} />
                    });
            }
        }
    },
    handleRedirectHome() {
        this.removeKeyDownListener();
        window.location.href = "/";
    },
    componentWillMount: function(){
        document.addEventListener("keydown", this.handleSpaceClick);
    },
    removeKeyDownListener() {
        document.removeEventListener("keydown", this.handleSpaceClick);
    },
    render() {
        return (
            <div className="container">
                {this.state.currentScreen}
            </div>
        );
    }
});


module.exports = OnBoardingContainer;
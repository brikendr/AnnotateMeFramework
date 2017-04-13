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
            hasFinishedRound: false
        }
    },
    handleChangeScreen(newScreenNr, hasFinished) {
        this.setState({
            screenNr: newScreenNr,
            hasFinishedRound: hasFinished == null ? true:hasFinished
        })
    },
    handleSpaceClick(e) {
        if(e.keyCode == 32 && (this.state.hasFinishedRound || this.state.screenNr == 1 || this.state.screenNr == 3)) {
            switch (this.state.screenNr) {
                case 1:
                    this.setState({
                        screenNr: 2,
                        hasFinishedRound: false,
                        currentScreen: <WaveScreen words={this.state.wave1Words} onFinishWave={this.handleSpaceClick} changeScreenNr={this.handleChangeScreen} />
                    });
                    break;
                case 2: 
                    this.setState({
                        screenNr: 3,
                        hasFinishedRound: false,
                        currentScreen: <PuzzleIntro onSpaceActionBtn={this.handleSpaceClick} />
                    });
                    break;
                case 3: {
                    this.setState({
                        screenNr: 4,
                        hasFinishedRound: false,
                        currentScreen: <EntityRevealScreen words={this.state.wave2Words} onFinishWave={this.handleSpaceClick} changeScreenNr={this.handleChangeScreen} />
                    });
                    break;
                }
                case 5: {
                    this.setState({
                        hasFinishedRound: false,
                        currentScreen: <RewardScreen onFinishWave={this.handleSpaceClick} redirectHome={this.handleRedirectHome} />
                    });
                    break;
                }
                default: 
                    break;
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
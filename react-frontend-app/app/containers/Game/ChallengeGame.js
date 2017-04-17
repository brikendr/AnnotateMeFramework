var React = require('react'),
    PropTypes = React.PropTypes,
    assets = require('../../utils/constatns').assets
    GameHelper = require('../../utils/GameHelper'),
    GameLoadingGif =  require('../../components/Game/GameLoadingGif'),
    ReactRedux = require("react-redux"),
    actions = require('../../redux/actions/authActions'),
    StateTyping = require('../../components/Game/Gameplay/StateTyping'),
    ChallengeIntro = require('../../components/Game/Extras/ChallengeIntro'),
    ChallengeFeedback = require('../../components/Game/Extras/ChallengeFeedback');

var ChallengeGame = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            currentGameState: "INTRO",
            possibleGameStates: ["INTRO", "PLAYING", "FEEDBACK", "FINISH_CHALLENGE"],
            challengedWPM: 45,
            challengedPoints: 5,
            challengeStatus: 0
        }
    },
    propTypes:{
        fetchingData: PropTypes.bool.isRequired,
        toggleDataFetching: PropTypes.func.isRequired
    },
    componentDidMount(){
        this.props.toggleDataFetching();
        this.props.toggleDataFetching();
        
        //document.addEventListener("keydown", this.commandListener);
    },
    redirectGame(path) {
        //document.removeEventListener("keydown", this.commandListener);
        this.context.router.push(path);
    },
    changeGameState(newState) {
        if(this.state.possibleGameStates.indexOf(newState) != -1) {
            this.setState({
                currentGameState: newState
            });
        }
    },
    handleStats(stats, charElementsStyled) {
        //TODO: save stats to db 
        var newStatus = stats.wpm == this.state.challengedWPM ? 3 : stats.wpm > this.state.challengedWPM ? 1:2;
        console.log('NEW STATS ', newStatus);
        this.setState({
            challengeStatus: newStatus
        });
    },
    render() {
        var screenToShow = null;
        
        switch(this.state.currentGameState) {
            case "INTRO": {
                screenToShow= <ChallengeIntro 
                    onGameStateChange={this.changeGameState}
                    challengee={this.props.User.information} 
                    challenger="Opponent" 
                    challengedWPM={this.state.challengedWPM}
                    challengedPoints={this.state.challengedPoints}/>
                break;
            }
            case "PLAYING": {
                screenToShow= <StateTyping 
                    onGameStateChange={this.changeGameState}
                    setTypingStats={this.handleStats} 
                    words={["test", "hello", "second"]}
                    entityToReveal="JOHNNY"
                    shouldPlayGamePoint={false}
                    nextScreen="FEEDBACK" />
                    break;
            }
            case "FEEDBACK": {
                screenToShow= <ChallengeFeedback 
                    onGameStateChange={this.changeGameState}
                    challengee={this.props.User.information.username}
                    challengeStatus={this.state.challengeStatus}
                    challengedPoints={this.state.challengedPoints} />
                    break;
            }
            case "FINISH_CHALLENGE": {
                //TODO: Anything to persist
                window.location.href = "/";
            }
        }
        return (
            this.props.fetchingData ? 
            <GameLoadingGif />
            :
            <div className="col-md-12">
                <div className="row justify-content-center">
                    {screenToShow}
                </div>
                <audio src={assetsDir+"/audio/Funky-guitar-logo.mp3"} id="finishRound"></audio>
            </div>
        )
    }
})

// connect to Redux store
var mapStateToProps = function(state){
    // This component will have access to `appstate.heroes` through `this.props.heroes`
    return {User: state.user, fetchingData: state.game.fetchingData};
};
var mapDispatchToProps = function(dispatch){
    return {
        toggleDataFetching: function() {dispatch(actions.toggleDataFetching())}
    }
};
module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(ChallengeGame);
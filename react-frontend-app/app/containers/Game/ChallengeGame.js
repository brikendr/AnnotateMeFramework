var React = require('react'),
    PropTypes = React.PropTypes,
    assets = require('../../utils/constatns').assets
    GameHelper = require('../../utils/GameHelper'),
    GameLoadingGif =  require('../../components/Game/GameLoadingGif'),
    ReactRedux = require("react-redux"),
    gameActions = require('../../redux/actions/utilActions'),
    StateTyping = require('../../components/Game/Gameplay/StateTyping'),
    ChallengeIntro = require('../../components/Game/Extras/ChallengeIntro'),
    ChallengeFeedback = require('../../components/Game/Extras/ChallengeFeedback'),
    LevelUp = require('../../components/Game/Extras/LevelUp');

var ChallengeGame = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            currentGameState: "INTRO",
            possibleGameStates: ["INTRO", "PLAYING", "FEEDBACK", "FINISH_CHALLENGE"],
            screenToShow: null,
            challengedWPM: 45,
            challengedPoints: 5,
            challengeStatus: 0,
            newLevel: null
        }
    },
    propTypes:{
        User: PropTypes.object.isRequired,
        PlayerStats: PropTypes.object.isRequired,
        Level: PropTypes.object.isRequired,
        setPlayerLevel: PropTypes.func.isRequired,
        setPlayerScore: PropTypes.func.isRequired
    },
    componentDidMount(){
        //document.addEventListener("keydown", this.commandListener);
        this.changeGameState("INTRO");
    },
    redirectGame(path) {
        //document.removeEventListener("keydown", this.commandListener);
        this.context.router.push(path);
    },
    changeGameState(newState) {
        var screenToShow = null;
        switch(newState) {
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
                    nextScreen="FEEDBACK"
                    PlayerStats={this.props.PlayerStats} />
                    break;
            }
            case "FEEDBACK": {
                screenToShow= <ChallengeFeedback 
                    onGameStateChange={this.changeGameState}
                    challengee={this.props.User.information.username}
                    challengeStatus={this.state.challengeStatus}
                    challengedPoints={this.state.challengedPoints}
                    persistPoints={this.persistPoints} />
                    break;
            }
            case "FINISH_CHALLENGE": {
                GameHelper.checkPlayerHasLeveledUp(this.props.Level, this.props.PlayerStats.Player)
                 .then(function(response){
                     if(response.resource.updated) {
                        //Player has leveld up 
                        var timoutTime = 1000;
                        if(response.resource.status == "upgrade") {
                            timoutTime = 10200;
                            this.setState({screenToShow: null,newLevel: <LevelUp currentLevelNr={this.props.Level.id} nextLevelNR={response.resource.newLevel.id} nextLevelName={response.resource.newLevel.name} />});
                        }
                        this.props.setPlayerLevel(response.resource.newLevel);
                        setTimeout(function(){
                            window.location.href = "/";
                        }, timoutTime);
                     } else {
                        window.location.href = "/";
                     }
                 }.bind(this));
            }
        }
        this.setState({screenToShow: screenToShow});
    },
    handleStats(stats, charElementsStyled) {
        //TODO: save stats to db 
        var newStatus = stats.wpm == this.state.challengedWPM ? 3 : stats.wpm > this.state.challengedWPM ? 1:2;
        
        this.setState({
            challengeStatus: newStatus
        });
    },
    persistPoints(points) {
        console.log("PERSISTING ", points);
        this.props.setPlayerScore(points);
        //Update Score in db 
        var PlayerInfo = this.props.PlayerStats.Player;
        GameHelper.registerPoint(PlayerInfo.points, PlayerInfo.id);
    },
    render() {
        return (
            <div className="col-md-12">
                <div className="row justify-content-center">
                    {this.state.screenToShow}
                </div>
                {this.state.newLevel}
            </div>
        )
    }
})

// connect to Redux store
var mapStateToProps = function(state){
    // This component will have access to `appstate.heroes` through `this.props.heroes`
    return {User: state.user, PlayerStats: state.game.playerStats.stats, Level: state.game.playerStats.level};
};
var mapDispatchToProps = function(dispatch){
    return {
        setPlayerWPM: function(jsonData){ dispatch(gameActions.setPlayerWPM(jsonData));},
        setPlayerLevel: function(jsonData){ dispatch(gameActions.setPlayerLevel(jsonData));},
        setPlayerScore: function(jsonData){ dispatch(gameActions.setPlayerScore(jsonData)); }
    }
};
module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(ChallengeGame);
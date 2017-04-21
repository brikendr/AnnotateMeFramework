var React = require('react'),
    PropTypes = React.PropTypes,
    assets = require('../../utils/constatns').assets
    GameHelper = require('../../utils/GameHelper'),
    GameLoadingGif =  require('../../components/Game/GameLoadingGif'),
    ReactRedux = require("react-redux"),
    authActions = require('../../redux/actions/authActions'),
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
            challengeId: this.props.routeParams.challengeId,
            currentGameState: "INTRO",
            possibleGameStates: ["INTRO", "PLAYING", "FEEDBACK", "FINISH_CHALLENGE"],
            screenToShow: null,
            opponent: "Opponent",
            gameRound: null,
            challengeObj: null,
            challengeStatus: 0,
            newLevel: null,
            persistedPoints: 0
        }
    },
    propTypes:{
        User: PropTypes.object.isRequired,
        PlayerStats: PropTypes.object.isRequired,
        Level: PropTypes.object.isRequired,
        setPlayerLevel: PropTypes.func.isRequired,
        setPlayerScore: PropTypes.func.isRequired,
        toggleDataFetching: PropTypes.func.isRequired
    },
    componentDidMount(){
        //document.addEventListener("keydown", this.commandListener);
        this.props.toggleDataFetching();
        //Get Challenge Data from DB
        GameHelper.getChallengeInfo(this.state.challengeId)
         .then(function(response){
            this.setState({
                opponent: response.resource.challenger.username,
                challengeObj: response.resource,
                gameRound: response.resource.Game
            });
            this.props.toggleDataFetching();
            this.changeGameState("INTRO");
         }.bind(this));
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
                    challenger={this.state.opponent}
                    challengedWPM={this.state.challengeObj.p1_wps}
                    challengedPoints={this.state.challengeObj.challenged_points}/>
                break;
            }
            case "PLAYING": {
                screenToShow= <StateTyping 
                    onGameStateChange={this.changeGameState}
                    setTypingStats={this.handleStats} 
                    words={this.state.gameRound.typing_paragraph.split(",")}
                    entityToReveal="CHALLENGE"
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
                    challengedPoints={this.state.challengeObj.challenged_points}
                    persistPoints={this.persistPoints} />
                    break;
            }
            case "FINISH_CHALLENGE": {
                //Save challenge
                var challengerPoints = this.state.challengeObj.challenger.points
                    challengerNewPoints = this.state.challengeStatus == 3 ? challengerPoints + (this.state.persistedPoints) : challengerPoints + (this.state.persistedPoints * -1);
                var data = {
                    'status': this.state.challengeStatus != 3 ? this.state.challengeStatus == 2 ? 1:2:3,
                    'challengeId': this.state.challengeObj.id,
                    'newPoints': challengerNewPoints,
                    'challengerId': this.state.challengeObj.challenger.id,
                    'shouldUpdatePlayerScore': true
                }
                
                GameHelper.updateChallenge(data).then(function(response){
                    //NOW Check if challengee has leveled up
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
                }.bind(this));
            }
        }
        this.setState({screenToShow: screenToShow});
    },
    handleStats(stats, charElementsStyled) {
        var newStatus = stats.wpm == this.state.challengeObj.p1_wps ? 3 : stats.wpm > this.state.challengeObj.p1_wps ? 1:2;
        this.setState({
            challengeStatus: newStatus
        });
    },
    persistPoints(points) {
        this.props.setPlayerScore(points);
        //Update Score in db 
        var PlayerInfo = this.props.PlayerStats.Player;
        GameHelper.registerPoint(PlayerInfo.points, PlayerInfo.id);
        this.setState({persistedPoints: points});
    },
    render() {
        return (
            this.props.fetchingData ? 
            <GameLoadingGif />
            :
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
    return {User: state.user, PlayerStats: state.game.playerStats.stats, Level: state.game.playerStats.level, fetchingData: state.game.fetchingData};
};
var mapDispatchToProps = function(dispatch){
    return {
        setPlayerWPM: function(jsonData){ dispatch(gameActions.setPlayerWPM(jsonData));},
        setPlayerLevel: function(jsonData){ dispatch(gameActions.setPlayerLevel(jsonData));},
        setPlayerScore: function(jsonData){ dispatch(gameActions.setPlayerScore(jsonData)); },
        toggleDataFetching: function() {dispatch(authActions.toggleDataFetching())},
    }
};
module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(ChallengeGame);
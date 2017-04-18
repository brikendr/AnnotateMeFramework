var React = require('react'),
    PropTypes = React.PropTypes,
    assets = require('../../utils/constatns').assets
    GameHelper = require('../../utils/GameHelper'),
    GameLoadingGif =  require('../../components/Game/GameLoadingGif'),
    ReactRedux = require("react-redux"),
    gameActions = require('../../redux/actions/utilActions'),
    SpaceActionBtn = require('../../components/Game/SpaceActionBtn'),
    StateTyping = require('../../components/Game/Gameplay/StateTyping'),
    BonusQuestion = require('../../components/Game/Gameplay/BonusQuestion'),
    RevealScreen = require('../../components/Game/Gameplay/RevealScreen'),
    ChallengeScreen = require('../../components/Game/Gameplay/ChallengeScreen'),
    LevelUp = require('../../components/Game/Extras/LevelUp');

var GameplayContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            currentGameState: "TYPING",
            possibleGameStates: ["TYPING", "BONUS_QUESTION", "RESOLVING_ENTITY", "BETTING", "POINTS_CHALLENGE", "COMPLETED"],
            screenToShow: null,
            wpm: 0,
            charElements: [],
            paragraph: ["The","quick", "brown", "fox", "dog" , "jumps", "over", "fox" ,"lazy"],
            bonusQuestion: {},
            newLevel: null
        }
    },
    propTypes:{
        PlayerStats: PropTypes.object.isRequired,
        setPlayerWPM: PropTypes.func.isRequired,
        Level: PropTypes.object.isRequired,
        setPlayerLevel: PropTypes.func.isRequired
    },
    componentDidMount(){
        //document.addEventListener("keydown", this.commandListener);
        this.changeGameState("TYPING");
    },
    commandListener(e) {
        switch(e.keyCode) {
            case 49: {
                alert('1');
                break;
            }
        }
    },
    redirectGame(path) {
        document.removeEventListener("keydown", this.commandListener);
        this.context.router.push(path);
    },
    changeGameState(newState) {
        var screenToShow = null;
        switch(newState) {
            case "TYPING": {
                screenToShow= <StateTyping 
                    onGameStateChange={this.changeGameState} 
                    setTypingStats={this.handleStats} 
                    words={this.state.paragraph}
                    entityToReveal="JOHNNY"
                    shouldPlayGamePoint={true}
                    nextScreen="BONUS_QUESTION"
                    PlayerStats={this.props.PlayerStats} />
                    break;
            }
            case "BONUS_QUESTION": {
                screenToShow= <BonusQuestion 
                    onGameStateChange={this.changeGameState} 
                    bonusQuestion={this.state.bonusQuestion}
                    />
                    break;
            }
            case "RESOLVING_ENTITY": {
                screenToShow = <RevealScreen 
                    onGameStateChange={this.changeGameState} 
                    charElements={this.state.charElements}
                    candidates={[{"id": 43,"candidate_name":"Johhny Chase"},{"id": 44,"candidate_name":"Johnny Depp"},{"id": 45,"candidate_name":"Johnny CORP"},{"id": 50,"candidate_name":"Johnny Gambini"}]}
                    contextClues={["Pirates of Caribbean", "Tourist", "Jack Sparrow", "Leading Role", "Scissorhands", "unique style"]}
                    PlayerId={this.props.PlayerStats.Player.id}
                    paragraph={this.state.paragraph}
                    wpm={this.state.wpm}
                         />
                    break;
            }
            case "POINTS_CHALLENGE": {
                screenToShow = <ChallengeScreen 
                    onGameStateChange={this.changeGameState}
                    challengePlayers={this.challengePlayers}
                    wpm={this.state.wpm}
                    />;
                break;
            } case "COMPLETED": {
                console.log(this.props.Level, this.props.PlayerStats.Player);
                GameHelper.checkPlayerHasLeveledUp(this.props.Level, this.props.PlayerStats.Player)
                 .then(function(response){
                     console.log(response);
                     if(response.resource.updated) {
                        //Player has leveld up 
                        if(response.resource.status == "upgrade") {
                            this.setState({currentGameState: "",newLevel: <LevelUp currentLevelNr={this.props.Level.id} nextLevelNR={response.resource.newLevel.id} nextLevelName={response.resource.newLevel.name} />});
                        }
                        this.props.setPlayerLevel(response.resource.newLevel);
                        setTimeout(function(){
                            window.location.href = "/";
                        }, 10200);
                     } else {
                        this.playAudio('finishRound');
                        setTimeout(function(){
                            window.location.href = "/";
                        }, 3000);
                     }
                 }.bind(this));
                 break;
            }
        }
        this.setState({screenToShow: screenToShow});
    },
    handleStats(stats, charElementsStyled, bonusQuestionObj) { 
        this.setState({
            wpm: stats.wpm,
            charElements: charElementsStyled,
            bonusQuestion: bonusQuestionObj
        });
        
        //Update WPM in DB
        GameHelper.updatePlayerWPM(stats.wpm, this.props.PlayerStats.Player.id)
            .then(function(updated){
                this.props.setPlayerWPM(stats.wpm);
            }.bind(this));
    },
    challengePlayers(playersToChallenge) {
        //TODO: register challenges
        console.log("REGISTERING CHALLENGES");
    },
    playAudio(soundID) {
        var audio = document.getElementById(soundID);		
        audio.play();
    },
    render() {
        return (
            <div className="col-md-12">
                <div className="row justify-content-center">
                    {this.state.screenToShow}
                </div>
                <audio src={assetsDir+"/audio/Funky-guitar-logo.mp3"} id="finishRound"></audio>
                {this.state.newLevel}
            </div>
        )
    }
})

// connect to Redux store
var mapStateToProps = function(state){
    // This component will have access to `appstate.heroes` through `this.props.heroes`
    return {PlayerStats: state.game.playerStats.stats, Level: state.game.playerStats.level};
};
var mapDispatchToProps = function(dispatch){
    return {
        setPlayerWPM: function(jsonData){ dispatch(gameActions.setPlayerWPM(jsonData));},
        setPlayerLevel: function(jsonData){ dispatch(gameActions.setPlayerLevel(jsonData));}
    }
};
module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(GameplayContainer);
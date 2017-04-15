var React = require('react'),
    PropTypes = React.PropTypes,
    assets = require('../../utils/constatns').assets
    GameHelper = require('../../utils/GameHelper'),
    GameLoadingGif =  require('../../components/Game/GameLoadingGif'),
    ReactRedux = require("react-redux"),
    actions = require('../../redux/actions/authActions'),
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
            wpm: 0,
            charElements: []
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
        if(this.state.possibleGameStates.indexOf(newState) != -1) {
            this.setState({
                currentGameState: newState
            });
        }
    },
    handleStats(stats, charElementsStyled) {
        //TODO: save stats to db 
        this.setState({
            wpm: stats.wpm,
            charElements: charElementsStyled
        });
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
        var screenToShow = null;
        
        switch(this.state.currentGameState) {
            case "TYPING": {
                screenToShow= <StateTyping 
                    onGameStateChange={this.changeGameState} 
                    setTypingStats={this.handleStats} 
                    words={["test", "hello", "second"]}
                    entityToReveal="JOHNNY" />
                    break;
            }
            case "BONUS_QUESTION": {
                screenToShow= <BonusQuestion 
                    onGameStateChange={this.changeGameState} 
                    question="Who is the president of united states"
                    candidates={["Barack Obama", "Bill Clinton", "George Bush", "Donald Trump"]}
                    correctAnswer={4} />
                    break;
            }
            case "RESOLVING_ENTITY": {
                screenToShow = <RevealScreen 
                    onGameStateChange={this.changeGameState} 
                    charElements={this.state.charElements}
                    candidates={["Johhny Chase", "Johnny Depp", "Johnny CORP", "Johnny Gambini"]}
                    contextClues={["Pirates of Caribbean", "Tourist", "Jack Sparrow", "Leading Role", "Scissorhands", "unique style"]}
                         />
                    break;
            }
            case "POINTS_CHALLENGE": {
                screenToShow = <ChallengeScreen 
                    onGameStateChange={this.changeGameState}
                    challengePlayers={this.challengePlayers}
                    wpm={30}
                    />;
                break;
            } case "COMPLETED": {
                //TODO: Anything to 
                this.playAudio('finishRound');
                setTimeout(function(){
                    window.location.href = "/";
                }, 3000);
                
            }
        }
        return (
            this.props.fetchingData ? 
            <GameLoadingGif />
            :
            <div>
                {screenToShow}

                <audio src={assetsDir+"/audio/Funky-guitar-logo.mp3"} id="finishRound"></audio>
                <LevelUp />
            </div>
        )
    }
})

// connect to Redux store
var mapStateToProps = function(state){
    // This component will have access to `appstate.heroes` through `this.props.heroes`
    return {fetchingData: state.game.fetchingData};
};
var mapDispatchToProps = function(dispatch){
    return {
        toggleDataFetching: function() {dispatch(actions.toggleDataFetching())}
    }
};
module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(GameplayContainer);
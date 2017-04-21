var React = require('react'),
    PropTypes = React.PropTypes,
    assets = require('../../utils/constatns').assets
    GameHelper = require('../../utils/GameHelper'),
    GameDataPrep = require('../../utils/GamaDataPrep'),
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
            gameRoundID: null,
            gameStart: new Date().getTime(),
            currentGameState: "TYPING",
            possibleGameStates: ["TYPING", "BONUS_QUESTION", "RESOLVING_ENTITY", "BETTING", "POINTS_CHALLENGE", "COMPLETED"],
            screenToShow: null,
            wpm: 0,
            charElements: [],
            bonusQuestion: {},
            newLevel: null,
            //DATA FROM DB
            entityMentionId: null,
            paragraph: [],
            entityName: "",
            entityCandidates: [],
            entityContextClues: [],
            countRecursionLoop: 0

        }
    },
    propTypes:{
        PlayerStats: PropTypes.object.isRequired,
        setPlayerWPM: PropTypes.func.isRequired,
        Level: PropTypes.object.isRequired,
        setPlayerLevel: PropTypes.func.isRequired
    },
    componentDidMount(){
        //Fetch gameround data
        this.getGameData();
    },
    getGameData() {
        GameDataPrep.fetchGameRoundData(this.props.PlayerStats.Player.id, this.props.location.state.categoryID)
         .then(function(gameData){
            if(gameData.candidates.length == 0) {
                var recursionLoop = this.state.countRecursionLoop;
                if(recursionLoop > 99) {
                    alert('WE ARE SORRY. THERE SEEMS TO BE NO MORE DATA AVAILABLE TO PLAY. PLEASE CONTACT brikend.rama@gmail.com');
                    window.location.href = "/";
                    return;
                }

                this.setState({countRecursionLoop: recursionLoop + 1});
                this.getGameData();
                return;
            }
            this.setState({
                entityMentionId: gameData.entity.id,
                entityName: gameData.entity.description,
                entityCandidates: gameData.candidates
            });
            this.setParagraph(gameData.entity.Sentance.description, function(){
                this.mappContextClues(gameData.docKeywords, gameData.neighborEntities, gameData.entity.Collocations, function(){
                    this.changeGameState("TYPING");
                }.bind(this));
            }.bind(this));
            
         }.bind(this));
    },
    setParagraph(sentanceText, callBack){
        var gameParagraph = sentanceText.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " "),
            paragraptArray = gameParagraph.split(" "),
            paragraphFiltered = paragraptArray.filter(function(e){return e});

        this.setState({
            paragraph: paragraphFiltered
        });
        callBack();
    },
    mappContextClues(docKeywords, neighborEntities, collcoations, callBack){
        var contextClues = [];
        //map neighbor entities
        for(var i=0; i< neighborEntities.length; i++){
            contextClues.push(neighborEntities[i].description);
        }
        //map document keywords
        for(var i=0; i< docKeywords.length; i++){
            contextClues.push(docKeywords[i].keyword);
        }
        //map collocations
        for(var i=0; i< collcoations.length; i++){
            contextClues.push(collcoations[i].collocation_json);
        }
        this.setState({
            entityContextClues: contextClues
        });
        callBack();
    },
    setGameRoundId(gameId) {
        this.setState({gameRoundID: gameId});
    },
    redirectGame(path) {
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
                    entityToReveal={this.state.entityName}
                    shouldPlayGamePoint={true}
                    nextScreen="BONUS_QUESTION"
                    PlayerStats={this.props.PlayerStats}/>
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
                    entityMentionId={this.state.entityMentionId}
                    candidates={this.state.entityCandidates}
                    contextClues={this.state.entityContextClues}
                    PlayerId={this.props.PlayerStats.Player.id}
                    paragraph={this.state.paragraph}
                    wpm={this.state.wpm}
                    setGameRoundId={this.setGameRoundId}
                    gameStart={this.state.gameStart}
                         />
                    break;
            }
            case "POINTS_CHALLENGE": {
                screenToShow = <ChallengeScreen 
                    onGameStateChange={this.changeGameState}
                    challengePlayers={this.challengePlayers}
                    wpm={this.state.wpm}
                    Player={this.props.PlayerStats.Player}
                    />;
                break;
            } case "COMPLETED": {
                //Update GameTimespan (For experimental purposes only)
                GameHelper.updateGameRoundFinishTime(this.state.gameRoundID);
                GameHelper.checkPlayerHasLeveledUp(this.props.Level, this.props.PlayerStats.Player)
                 .then(function(response){
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
    challengePlayers(playersToChallenge, challengedPoints) {
        if(playersToChallenge.length > 0) {
            //challenge only if player has selected someone to challenge
            var data = {
                'challengees': playersToChallenge, 
                'player': this.props.PlayerStats.Player.id, 
                'wpm': this.state.wpm, 
                'challengedPoints': challengedPoints, 
                'gameId': this.state.gameRoundID
            }
            GameHelper.registerChallengers(data)
             .then(function(response) {
                console.log('CHALLENGE PERSISTED');
             });
        }
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
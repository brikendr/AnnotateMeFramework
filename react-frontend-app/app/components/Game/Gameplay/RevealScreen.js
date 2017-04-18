var React = require('react');
var PropTypes = React.PropTypes,
    assets = require('../../../utils/constatns').assets,
    calculateWPM = require('../../../utils/globalFunctions').caluclateWPM,
    GameHelper = require('../../../utils/GameHelper'),
    GameCandidate = require('./GameCandidate'),
    GameClue = require('../GameClues'),
    BetModal = require('./BetModal'),
    SpaceActionBtn = require('../SpaceActionBtn'),
    GamePoint = require('./GamePoint');

var RevealScreen = React.createClass({
    getInitialState: function() {
        return {
            mappedCandidates: [],
            mappedClues: [],
            animation: "",
            selectedACandidate: false,
            selectedCandidate: null,
            bettingPoints: 10,
            playerIsBetting: false,
            hasPlayerBet: false,
            showGamePoint: null
        }
    },
    componentDidMount() {
        var i = 1;
        console.log(this.props.candidates);
        const mappedCandidates = this.props.candidates.map(candidate => 
            <GameCandidate key={candidate.id} name={candidate.candidate_name} number={i++}/>                  
        );

        var i = 1;
        const mappedClues = this.props.contextClues.map(clue => 
            <GameClue key={i++} clue={clue} />               
        );

        this.setState({
            mappedCandidates: mappedCandidates,
            mappedClues: mappedClues
        });
        document.body.addEventListener("keydown", this.handleCandidateSelection);
        this.loadDependencies();
    },
    loadDependencies() {
        require('../../../styles/speedometer.css');
        require('../../../assets/js/speedometer.js');
        require('../../../styles/stickynotes.css');
    },
    handleCandidateSelection(e){
        var val = this.state.bettingPoints;
        if([49, 50, 51, 52].indexOf(e.keyCode) != -1) {
            this.setState({selectedCandidate: e.keyCode - 49,animation: "bg-green-jungle bg-font-green-jungle animated bounce", showGamePoint: <GamePoint point={5}/>});
            this.playAudio("check-right");
            setTimeout(function () {
                this.setState({animation: "", selectedACandidate: true});
            }.bind(this), 3000);
        }  
        else if(e.keyCode == 27 && this.state.playerIsBetting) {
            this.toggleModal();
            this.setState({playerIsBetting: false});
        }
        else if((e.ctrlKey && e.keyCode == 66) && !this.state.playerIsBetting) {
            this.toggleModal();
            this.setState({playerIsBetting: true});
        }
        else if((e.ctrlKey && e.keyCode == 32) && !this.state.playerIsBetting && this.state.selectedACandidate) {
            this.unbindListeners();
        }
        else if (e.keyCode == 37 && this.state.playerIsBetting) {
            //left ARROW
            if(val > 10){
                this.setState({bettingPoints: (val - 10)});
            }           
        } 
        else if (e.keyCode == 39) {
            //right arrow
            if(val < 100){
                this.setState({bettingPoints: (val + 10)});
            }
        } 
        else if((e.ctrlKey && e.keyCode == 32) && this.state.playerIsBetting) {
            this.toggleModal();
            //this.registerBettingPoints();
            this.setState({playerIsBetting: false, hasPlayerBet: true});
        }
        
    },
    unbindListeners() {
        document.body.removeEventListener("keydown", this.handleCandidateSelection);
        //Persist Game data and betting (if player has bet)
        var gameData = {
            'wps': this.props.wpm,
            'typing_paragraph': this.props.paragraph.join(),
            'betscore': this.state.hasPlayerBet ? (this.state.bettingPoints / 10):0,
            'EntityMentionId': 11,
            'CandidateId': this.props.candidates[this.state.selectedCandidate].id,
            'PlayerId': this.props.PlayerId
        }
        GameHelper.persistGameRound(gameData)
         .then(function(response){
            console.log('GAME REGISTERED')
            console.log(response);
            this.props.onGameStateChange("POINTS_CHALLENGE");
         }.bind(this));
        
    },
    registerBettingPoints() {
        
    },
    toggleModal() {
        var modalWrapper = document.querySelector('.modal-wrapper');
        modalWrapper.classList.toggle('open');
    },
    playAudio(soundID) {
        var audio = document.getElementById(soundID);		
        audio.play();
    },
    render() {
        var degrees = 'rotate('+this.state.speedometerDegree+'deg)';
        var spedometerCss = {
            transform: degrees 
        }
        
        return ( 
            <div className="col-md-12">
                {!this.state.selectedACandidate ?
                <div className={"row justify-content-center"}>
                    <div className="col-10 text-center stickyNotesDiv">
                        
                            <ul>
                                {this.state.mappedClues}
                            </ul>
                    </div>
                </div> : ""}

                <div className={"row justify-content-center "}  >
                    <div className="col-5 text-center">
                        <div className="clearfix">
                            <audio src={assetsDir+"/audio/levelup.wav"} id="check-right"></audio>
                            <p>
                                {this.props.charElements}
                            </p>
                        </div>
                    </div>
                </div>
                {this.state.selectedACandidate ?
                <div className={"row justify-content-center animated flipInX"}>
                    <div className="col-4 text-center">
                        AWESOME! You selected <strong>{this.props.candidates[this.state.selectedCandidate].candidate_name}</strong>
                    </div>                    
                </div>
                : ""
                }
                
                <div className={"row justify-content-center "+ (this.state.selectedACandidate ? "hidden":"")}  >
                    <div className="col-8 text-center">
                        <div className={"row "+ this.state.animation}>
                            {this.state.mappedCandidates}
                        </div>
                        <div className="row justify-content-center">
                            <h5>Press the number to select candidate!</h5>
                        </div>
                    </div>
                </div>
                
                {this.state.selectedACandidate ? 
                    <BetModal   handleCandidateSelection={this.handleCandidateSelection}
                                points={this.state.bettingPoints}/> : ""}
                

                {this.state.selectedACandidate ? 
                <div className="container col-md-10 marginTop5">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <h4>{this.state.hasPlayerBet ? "YOU have bet " + (this.state.bettingPoints / 10)+ " points": "Wanna BET? Press CTRL + B!"}</h4>
                        </div>
                        <SpaceActionBtn command="CTRL + SPACE" message="Continue" />
                    </div>
                </div>
                :
                ""
                }

                {this.state.showGamePoint}
            </div>
        );
    }
});
RevealScreen.propTypes = {
    onGameStateChange: PropTypes.func.isRequired,
    charElements: PropTypes.array.isRequired,
    candidates: PropTypes.array.isRequired,
    contextClues: PropTypes.array.isRequired,
    PlayerId: PropTypes.number.isRequired,
    paragraph: PropTypes.array.isRequired,
    wpm: PropTypes.number.isRequired
};

var styles = {
    numberCircle: {
        borderRadius: '50%',
        width: '120px',
        fontSize: '32px',
        border: '2px solid #666'
    },
    numberCircleSpan: {
        textAlign: 'center',
        lineHeight: '120px',
        display: 'block'
    }
}

module.exports = RevealScreen;
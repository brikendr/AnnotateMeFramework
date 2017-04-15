var React = require('react');
var PropTypes = React.PropTypes,
    assets = require('../../../utils/constatns').assets,
    calculateWPM = require('../../../utils/globalFunctions').caluclateWPM,
    GameCandidate = require('./GameCandidate'),
    GameClue = require('../GameClues'),
    BetModal = require('./BetModal'),
    SpaceActionBtn = require('../SpaceActionBtn');

var RevealScreen = React.createClass({
    getInitialState: function() {
        return {
            mappedCandidates: [],
            mappedClues: [],
            animation: "",
            selectedACandidate: false,
            selectedCandidate: null
        }
    },
    componentDidMount() {
        var i = 1;
        const mappedCandidates = this.props.candidates.map(candidate => 
            <GameCandidate key={i} name={candidate} number={i++}/>                  
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
    },
    handleCandidateSelection(e){
        if([49, 50, 51, 52].indexOf(e.keyCode) != -1) {
            this.setState({selectedCandidate: e.keyCode - 49,animation: "bg-green-jungle bg-font-green-jungle animated bounce"});
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
        else if((e.ctrlKey && e.keyCode == 32) && !this.state.playerIsBetting) {
            this.unbindListeners();
        }
    },
    unbindListeners() {
        document.body.removeEventListener("keydown", this.handleCandidateSelection);
        this.props.onGameStateChange("POINTS_CHALLENGE");
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
            <div>
                <div className={"row justify-content-center"}>
                    <div className="col-6 text-center">
                        <div className="clearfix">
                            <ul>
                                {this.state.mappedClues}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={"row justify-content-center "}  >
                    <div className="col-5 text-center">
                        <div className="clearfix">
                            <audio src={assetsDir+"/audio/Winning-sound-effect.mp3"} id="check-right"></audio>
                            <p>
                                {this.props.charElements}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={"row justify-content-center " + (this.state.selectedACandidate ? "animated flipInX":"hidden")}>
                    <div className="col-4 text-center">
                        You ARE DOING GOOD! You selected {this.props.candidates[this.state.selectedCandidate]}
                    </div>                    
                </div>
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
                
                {this.state.selectedACandidate ? <BetModal title="BET"/> : ""}
                

                {this.state.selectedACandidate ? 
                <div className="container col-md-10 marginTop5">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <h4>Wanna BET? Press CTRL + B!</h4>
                        </div>
                        
                        <div className="col-md-6">
                            <SpaceActionBtn message="CTRL + SPACE to Continue"/>
                        </div>
                    </div>
                </div>
                :
                ""
                }
            </div>
        );
    }
});
RevealScreen.propTypes = {
    onGameStateChange: PropTypes.func.isRequired,
    charElements: PropTypes.array.isRequired,
    candidates: PropTypes.array.isRequired,
    contextClues: PropTypes.array.isRequired
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
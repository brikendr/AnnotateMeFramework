var React = require('react');
var PropTypes = React.PropTypes,
    assetsDir = require('../../../utils/constatns').assets,
    calculateWPM = require('../../../utils/globalFunctions').caluclateWPM,
    GameCandidate = require('./GameCandidate');

var BonusQuestion = React.createClass({
    getInitialState: function() {
        return {
            mappedCandidates: [],
            animation: ""
        }
    },
    componentDidMount() {
        cadList = [];
        
        var i = 1;

        const mappedCandidates = this.props.candidates.map(candidate => 
            <GameCandidate key={i} name={candidate} number={i++}/>
                            
        );
        
        this.setState({
            mappedCandidates: mappedCandidates
        });
        document.body.addEventListener("keydown", this.handleCandidateSelection);
    },
    handleCandidateSelection(e){
        if([49, 50, 51, 52].indexOf(e.keyCode) != -1) {
            if(e.keyCode == (48 + this.props.correctAnswer)) {
                this.setState({animation: "bg-green-jungle bg-font-green-jungle animated bounce"});
                this.playAudio("check-right");
            } else {
                this.setState({animation: "bg-red-mint bg-font-red-mint animated shake"});
                this.playAudio("check-wrong");
            }
            this.unbindListeners();
        } 
    },
    unbindListeners() {
        document.body.removeEventListener("keydown", this.handleCandidateSelection);
        setTimeout(function () {
            this.props.onGameStateChange("RESOLVING_ENTITY");
        }.bind(this), 3000);
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
                <div className="row justify-content-center marginTop5 animated zoomIn" style={styles.centerIt}>
                    <div className="col-4 text-center">
                        <h1 className="animated fadeInUp" >BONUS QUESTION!</h1>
                    </div>
                </div>
                <div className="row justify-content-center animated zoomIn" style={styles.centerIt}>
                    <div className="col-4 text-center">
                        <h2 className="animated fadeInUp font-green-sharp">
                            {this.props.question}
                        </h2>
                    </div>
                </div>
                <div className={"row justify-content-center "}  >
                    <div className="col-8 text-center">
                        <div className={"row "+ this.state.animation}>
                            <audio src={assetsDir+"/audio/levelup.wav"} id="check-right"></audio>
                            <audio src={assetsDir+"/audio/Button-sound-wrong.mp3"} id="check-wrong"></audio>
                            {this.state.mappedCandidates}
                        </div>
                        <div className="row justify-content-center">
                            <h5>Press the number to select candidate!</h5>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
BonusQuestion.propTypes = {
    onGameStateChange: PropTypes.func.isRequired,
    question: PropTypes.string.isRequired,
    candidates: PropTypes.array.isRequired,
    correctAnswer: PropTypes.number.isRequired,
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

module.exports = BonusQuestion;
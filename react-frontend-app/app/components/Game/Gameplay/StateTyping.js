require('../../../styles/speedometer.css');
require('../../../assets/js/speedometer.js');
var React = require('react');
var PropTypes = React.PropTypes,
    assets = require('../../../utils/constatns').assets,
    calculateWPM = require('../../../utils/globalFunctions').caluclateWPM,
    GamePoint = require('./GamePoint'),
    constants = require('../../../utils/constatns'),
    BonusQuestionAlgorithm = require('../../../utils/BonusQuestionAlgo');

var StateTyping = React.createClass({
    getInitialState: function() {
        return {
            started: false,
            startTimespan: null,
            wordStartTimespan: null,
            currentWordIndex: 0,
            currentWord:    <button className="btn sbold btn-circle btn-lg animated zoomIn">{this.props.words[0]}</button>,
            previousWord:   "",
            nextWord:       <button className="btn sbold btn-circle btn-xs grey-salsa animated zoomIn">{this.props.words[1]}</button>,
            accumulatedRevealCount: 0,
            nextCharToReveal: 0,
            characterElements: [],
            inputText: "",
            speedometerDegree:  Math.round(0*180/constants.maximumSpeed)-45,
            wpm: 0,
            isEntityRevealed: false,
            showGamePoint: null,
        }
    },
    componentDidMount() {
        var entityCharacters = this.props.entityToReveal.split('');
        var charElements = [];
        for(var i = 0; i<entityCharacters.length; i++){
            charElements[i] = <button key={i} type="button" className="btn uppercase btn-circle blue btn-outline animated flipInX "></button>;
        }
        this.setState({
            characterElements: charElements
        });
        BonusQuestionAlgorithm.init(this.props.words);
    },
    hanldeFastType(e) {
        if(e.keyCode == 32) {
            var currentText = this.state.inputText.trim();
            var displayWord = this.props.words[this.state.currentWordIndex];
            if(currentText.toUpperCase() === displayWord.toUpperCase()) {
                //Display Next Word
                nextIndex = this.state.currentWordIndex + 1;
                if(nextIndex >= this.props.words.length) {
                    this.setState({
                        currentWord: <img src={assets + "img/thumbsup.png"} width="20%" />,
                        previousWord: "",
                        nextWord: "",
                        inputText: "",
                        hideInputField: "hidden",
                        hideActionBtn: ""
                    });
                } else {
                    var nextWord = this.props.words[nextIndex + 1] == null ? "": <button className="btn sbold btn-circle btn-xs grey-salsa animated slideInRight">{this.props.words[nextIndex + 1].toLowerCase()}</button>;
                    this.setState({
                        currentWord:    <button className="btn sbold btn-circle btn-lg animated slideInRight">{this.props.words[nextIndex].toLowerCase()}</button>,
                        previousWord:   <button className="btn sbold btn-circle btn-xs green-jungle animated slideInRight">{this.props.words[nextIndex - 1].toLowerCase()}</button>,
                        nextWord:       nextWord,
                        inputText: "",
                        currentWordIndex: nextIndex
                    });
                }
                this.handleCharacterReveal();
                this.playAudio("check-right");
            } else {
                //make a red background 
                this.setState({
                    currentWord: <button className="btn sbold btn-circle btn-lg red-mint animated shake">{this.props.words[this.state.currentWordIndex].toLowerCase()}</button>,
                    inputText: currentText
                });
                this.playAudio("check-wrong");
                BonusQuestionAlgorithm.incrementWrongCounter();
            }
            

            //refresh word timespan timer 
            BonusQuestionAlgorithm.setWordsWithTimer(this.state.currentWordIndex, this.state.wordStartTimespan, new Date().getTime());
            this.setState({wordStartTimespan: new Date().getTime()});
        } else {
            this.setState({
                currentWord: <button className="btn sbold btn-circle btn-lg">{this.props.words[this.state.currentWordIndex].toLowerCase()}</button>
            });
        }
    },
    calculateCurrentSpeed(currentTime, lastCalculation){
        var wordsPerMin = calculateWPM(this.state.currentWordIndex, currentTime, this.state.startTimespan);
        
        updatedSpeed = Math.round(wordsPerMin*180/constants.maximumSpeed)-45;
        this.setState({
            wpm:  wordsPerMin,
            speedometerDegree: updatedSpeed
        });
        if (lastCalculation) {
            setTimeout(function() {
                //Get the bonus question 
                var questionObj = BonusQuestionAlgorithm.selectRandomQuestion();
                //Set Typing Stats
                this.props.setTypingStats({wpm: this.state.wpm}, this.state.characterElements, questionObj);
                this.unbindListeners();
            }.bind(this), 100);
            
        }
    },
    handleCharacterReveal(){
        var currentWordIndex = this.state.currentWordIndex + 1;
        var totalWords = this.props.words.length;
        var totalChars = this.state.characterElements.length; 
        var wordsPerCharacter = Math.round(totalWords / totalChars);
        var accumulatedRevCount = this.state.accumulatedRevealCount;
        var nextCharToReveal = this.state.nextCharToReveal;
        var elements = this.state.characterElements;

        if(currentWordIndex == (accumulatedRevCount + wordsPerCharacter)) {
            //reveal character in order 
            elements[nextCharToReveal] = <button key={nextCharToReveal} type="button" className="btn btn-circle green btn-outline animated flipInX ">{this.props.entityToReveal.charAt(nextCharToReveal)}</button>;
            
            this.setState({
                characterElements: elements,
                nextCharToReveal: nextCharToReveal + 1,
                accumulatedRevealCount: accumulatedRevCount + wordsPerCharacter
            });
        }
        
        if(currentWordIndex >= totalWords && nextCharToReveal <= elements.length - 1) {
            for(var i= nextCharToReveal; i < elements.length; i++) {
                elements[i] = <button key={i} type="button" className="btn btn-circle green btn-outline animated flipInX ">{this.props.entityToReveal.charAt(i)}</button>;
            
                this.setState({
                    characterElements: elements
                });
            }
            this.setState({isEntityRevealed: true, currentWordIndex: currentWordIndex, showGamePoint: <GamePoint point={10}/>});
            this.calculateCurrentSpeed(new Date().getTime(), true);
        }
    },
    unbindListeners() {
        setTimeout(function () {
            this.props.onGameStateChange(this.props.nextScreen);
        }.bind(this), 3000);
    },
    handleInputChange(event) {
        if(this.state.started == false && event.target.value.trim() != "") {
            this.setState({
                started: true,
                startTimespan: new Date().getTime(),
                wordStartTimespan: new Date().getTime()
            });
            var refreshId = setInterval(function() {
                this.calculateCurrentSpeed(new Date().getTime(), false);
                if (this.state.isEntityRevealed) {
                    clearInterval(refreshId);
                }
            }.bind(this), 100);
        }
        this.setState({
            inputText: event.target.value
        });
        
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
            <div className="col-md-10">
                <div className={"row justify-content-center marginTop5"}  >
                    <div className="col-5 text-center">
                        <div className="clearfix">
                            <p>
                                {this.state.characterElements}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center margin-top-10">
                    <div className="col-4 text-center">
                        <audio src="https://s3.amazonaws.com/freecodecamp/simonSound2.mp3" id="check-right"></audio>
                        <audio src={constants.assets+"/audio/Button-sound-wrong.mp3"} id="check-wrong"></audio>
                        {this.state.previousWord} &nbsp;
                        {this.state.currentWord} &nbsp;
                        {this.state.nextWord}
                    </div>
                </div>
                <div className={"row justify-content-center margin-top-10 " + (this.state.isEntityRevealed ? "hidden":"")}>
                    <div className="col-4 text-center">
                        <div className="form-group form-md-line-input has-success animated fadeInUp">
                            <input className="form-control input-lg" autoFocus value={this.state.inputText} onChange={this.handleInputChange} onKeyDown={this.hanldeFastType} type="text"/>
                            <label htmlFor="form_control_1"></label>
                        </div>
                    </div>
                </div>

                <div className={"row justify-content-center margin-top-10 "}>
                    <div className="col-3 text-center">
                        <div className="speedbox">
                        <div className="speedbox__score" id="speedbox-score" style={spedometerCss}></div>
                        <div className="speedbox__groove"></div>
                        <div className="speedbox__odo">
                            <div className="speedbox__down"><i className="fa fa-flash"></i> {this.state.wpm}<span> WPM</span></div>
                        </div>
                        <div className="speedbox__base"></div>

                        </div>
                    </div>
                </div>

                {this.props.shouldPlayGamePoint ? this.state.showGamePoint:""}
            </div>
        );
    }
});
StateTyping.propTypes = {
    onGameStateChange: PropTypes.func.isRequired,
    setTypingStats: PropTypes.func.isRequired,
    words: PropTypes.array.isRequired,
    entityToReveal: PropTypes.string.isRequired,
    shouldPlayGamePoint: PropTypes.bool.isRequired,
    nextScreen: PropTypes.string.isRequired
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

module.exports = StateTyping;
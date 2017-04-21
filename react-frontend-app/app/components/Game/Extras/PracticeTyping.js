require('../../../styles/speedometer.css');
require('../../../assets/js/speedometer.js');
var React = require('react');
var PropTypes = React.PropTypes,
    calculateWPM = require('../../../utils/globalFunctions').caluclateWPM,
    constants = require('../../../utils/constatns'),
    SpaceActionBtn = require('../SpaceActionBtn');

var PracticeTyping = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            words: ['Made','from','day','morning','brought','together','move','lights','fire','under','six','upon','make','were','was','likeness','morning','is','it','dry','stars','does','days','seasons','in','his','days','called','without','land','form','fruit','abundantly','fish','creep','creature','years','water','day','itself','sea','god','from','fourth','winged','said','called','the','have','moved','air','living','greater','make','sixth','itself','fruitful','done','had','lesser','all','air','fruitful','beginning','all','wherein','heaven','kind','moving','him','days','forth','was','there','beginning','his','gathered','spirit','water','made','all','morning','sixth','saw','subdue','the','in','itself','called','own','beast','meat','gathered','divide','signs','herb','you','fly','had','lights','own','greater','air','and','bean','unto','dry','their','army','void','female','appear','first','was','creature','lights','spirit','saying','greater','after','is','dominion','and','so','all','brought','great','won','seas','very','one','kind','moving','all','light','bearing','god','darkness','above','to','likeness','greater','him','fourth','us','there','fourth','moved','over','creep','over','their','whales','bring','life','good','in','under','set','green','abundantly','unto','waters','divided','make','rule','you','are','amazing','that','you','holded','up','so','far','until','now','without','stopping','and','getting','tired','that','is','what','she','said',':D'],
            currentWordIndex: 0,
            acumulativeWords: 0,
            startTimespan: null,
            started: false,
            currentWord:    "",
            previousWord:   "",
            nextWord:       "",
            inputText: "",
            speedometerDegree:  Math.round(0*180/constants.maximumSpeed)-45,
            wpm: 0
        }
    },
    componentDidMount() {
        this.setState({
            currentWord:    <button className="btn sbold btn-circle btn-lg animated zoomIn">{this.state.words[0]}</button>,
            nextWord:       <button className="btn sbold btn-circle btn-xs grey-salsa animated zoomIn">{this.state.words[1]}</button>,
        })
    },
    hanldeFastType(e) {
        if(e.keyCode == 32) {
            var currentText = this.state.inputText.trim();
            var displayWord = this.state.words[this.state.currentWordIndex];
            var acumulativeWords = this.state.acumulativeWords;
            if(currentText.toUpperCase() === displayWord.toUpperCase()) {
                //Display Next Word
                nextIndex = this.state.currentWordIndex + 1;
                acumulativeWords++;
                if(nextIndex >= this.state.words.length) {
                    this.setState({
                        currentWord:    <button className="btn sbold btn-circle btn-lg animated slideInRight">{this.state.words[0].toLowerCase()}</button>,
                        previousWord:   <button className="btn sbold btn-circle btn-xs green-jungle animated slideInRight">{this.state.words[this.state.words.length - 1].toLowerCase()}</button>,
                        nextWord:       <button className="btn sbold btn-circle btn-xs grey-salsa animated slideInRight">{this.state.words[1].toLowerCase()}</button>,
                        inputText: "",
                        currentWordIndex: 0,
                        acumulativeWords: acumulativeWords
                    });
                } else {
                    var nextWord = this.state.words[nextIndex + 1] == null ? this.state.words[0]:this.state.words[nextIndex + 1];
                    this.setState({
                        currentWord:    <button className="btn sbold btn-circle btn-lg animated slideInRight">{this.state.words[nextIndex].toLowerCase()}</button>,
                        previousWord:   <button className="btn sbold btn-circle btn-xs green-jungle animated slideInRight">{this.state.words[nextIndex - 1].toLowerCase()}</button>,
                        nextWord:       <button className="btn sbold btn-circle btn-xs grey-salsa animated slideInRight">{nextWord.toLowerCase()}</button>,
                        inputText: "",
                        currentWordIndex: nextIndex,
                        acumulativeWords: acumulativeWords
                    });
                }
                this.playAudio("check-right");
            } else {
                //make a red background 
                this.setState({
                    currentWord: <button className="btn sbold btn-circle btn-lg red-mint animated shake">{this.state.words[this.state.currentWordIndex].toLowerCase()}</button>,
                    inputText: currentText
                });
                this.playAudio("check-wrong");
            }
        }
        else if(e.ctrlKey && e.keyCode == 88) {
            window.location.href = "/";
        } 
        else {
            this.setState({
                currentWord: <button className="btn sbold btn-circle btn-lg">{this.state.words[this.state.currentWordIndex].toLowerCase()}</button>
            });
        }
    },
    calculateCurrentSpeed(currentTime){
        var wordsPerMin = calculateWPM(this.state.acumulativeWords, currentTime, this.state.startTimespan);
        
        updatedSpeed = Math.round(wordsPerMin*180/constants.maximumSpeed)-45;
        this.setState({
            wpm:  wordsPerMin,
            speedometerDegree: updatedSpeed
        });
    },
    handleInputChange(event) {
        if(this.state.started == false && event.target.value.trim() != "") {
            this.setState({
                started: true,
                startTimespan: new Date().getTime()
            });
            var refreshId = setInterval(function() {
                this.calculateCurrentSpeed(new Date().getTime());
                if (this.state.isEntityRevealed) {
                    clearInterval(refreshId);
                }
            }.bind(this), 100);
        }
        this.setState({
            inputText: event.target.value.trim()
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
                <div className="col-md-12 marginTop10">
                    <div className="row justify-content-center">
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
                    <SpaceActionBtn command="CTRL + X" message="EXIT PRACTICE" divSize={12}/>
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

                    
                </div>
        );
    }
});

module.exports = PracticeTyping;
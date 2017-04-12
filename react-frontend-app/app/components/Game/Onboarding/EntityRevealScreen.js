var React = require('react');
var PropTypes = React.PropTypes;
var SpaceActionBtn = require('../SpaceActionBtn');
var Candidate = require('../Candidate');
var GameClue = require('../GameClues');
require('../../../styles/stickynotes.css');

var EntityRevealScreen = React.createClass({
    getInitialState: function() {
        return {
            started: false,
            startTimespan: null,
            currentWordIndex: 0,
            currentWord:    <button className="btn sbold btn-circle btn-lg animated zoomIn">{this.props.words[0]}</button>,
            previousWord:   "",
            nextWord:       <button className="btn sbold btn-circle btn-xs grey-salsa animated zoomIn">{this.props.words[1]}</button>,
            words: this.props.words,
            entityToReveal: "JOHNNY",
            accumulatedRevealCount: 0,
            nextCharToReveal: 0,
            characterElements: [],
            inputText: "",
            isEntityRevealed: false,
            didFinishRound: false,
            correctAnswer: 1
        }
    },
    componentDidMount() {
        var entityCharacters = this.state.entityToReveal.split('');
        var charElements = [];
        for(var i = 0; i<entityCharacters.length; i++){
            charElements[i] = <button key={i} type="button" className="btn uppercase btn-circle blue btn-outline animated flipInX "></button>;
        }
        this.setState({
            characterElements: charElements
        });
    },
    hanldeFastType(e) {
        if(e.keyCode == 32) {
            var currentText = this.state.inputText.trim();
            var displayWord = this.state.words[this.state.currentWordIndex];
            if(currentText === displayWord) {
                //Display Next Word
                nextIndex = this.state.currentWordIndex + 1;
                if(nextIndex >= this.state.words.length) {
                    this.setState({
                        currentWord: <img src="app/assets/img/thumbsup.png" width="20%" />,
                        previousWord: "",
                        nextWord: "",
                        inputText: "",
                        hideInputField: "hidden",
                        hideActionBtn: ""
                    });
                    this.generateStats(new Date().getTime());
                } else {
                    this.setState({
                        currentWord:    <button className="btn sbold btn-circle btn-lg animated slideInRight">{this.props.words[nextIndex]}</button>,
                        previousWord:   <button className="btn sbold btn-circle btn-xs green-jungle animated slideInRight">{this.props.words[nextIndex - 1]}</button>,
                        nextWord:       <button className="btn sbold btn-circle btn-xs grey-salsa animated slideInRight">{this.props.words[nextIndex + 1]}</button>,
                        inputText: "",
                        currentWordIndex: nextIndex
                    });
                }
                this.handleCharacterReveal();
            } else {
                //make a red background 
                this.setState({
                    currentWord: <button className="btn sbold btn-circle btn-lg red-mint animated shake">{this.state.words[this.state.currentWordIndex]}</button>,
                    inputText: currentText
                });
            }
        } else {
            this.setState({
                currentWord: <button className="btn sbold btn-circle btn-lg">{this.state.words[this.state.currentWordIndex]}</button>
            });
        }

        
    },
    handleCharacterReveal(){
        var currentWordIndex = this.state.currentWordIndex + 1;
        var totalWords = this.state.words.length;
        var totalChars = this.state.characterElements.length; 
        var wordsPerCharacter = Math.round(totalWords / totalChars);
        var accumulatedRevCount = this.state.accumulatedRevealCount;
        var nextCharToReveal = this.state.nextCharToReveal;
        var elements = this.state.characterElements;

        console.log(currentWordIndex,accumulatedRevCount,wordsPerCharacter)
        if(currentWordIndex == (accumulatedRevCount + wordsPerCharacter)) {
            //reveal character in order 
            elements[nextCharToReveal] = <button key={nextCharToReveal} type="button" className="btn uppercase btn-circle green btn-outline animated flipInX ">{this.state.entityToReveal.charAt(nextCharToReveal)}</button>;
            
            this.setState({
                characterElements: elements,
                nextCharToReveal: nextCharToReveal + 1,
                accumulatedRevealCount: accumulatedRevCount + wordsPerCharacter
            });
        }
        
        if(currentWordIndex >= totalWords && nextCharToReveal <= elements.length - 1) {
            for(var i= nextCharToReveal; i < elements.length; i++) {
                elements[i] = <button key={i} type="button" className="btn uppercase btn-circle green btn-outline animated flipInX ">{this.state.entityToReveal.charAt(i)}</button>;
            
                this.setState({
                    characterElements: elements
                });
            }
            this.setState({
                isEntityRevealed: true
            });
        }
    },
    handleCandidateSelection(e) {
        console.log('canidadte selection');
        if(e.keyCode == (48 + this.state.correctAnswer)) {
            this.setState({
                didFinishRound: true
            });
            this.props.changeScreenNr(5);
        } else {
            this.setState({
                didFinishRound: false
            });
            this.props.changeScreenNr(5, false);
        }
    },
    handleInputChange(event) {
        if(this.state.started == false) {
            this.setState({
                started: true,
                startTimespan: new Date().getTime()
            });
        }
        this.setState({
            inputText: event.target.value
        });
        
    },
    generateStats(stoptime){
        var diffSeconds = (stoptime - this.state.startTimespan) / 1000;
        var totalWords = this.state.words.length;

        //Calculate WPS (Words per minute)
        var wps = totalWords * 60 / diffSeconds;
        this.setState({
            stats: <span>Your Speed: <strong>{Math.round(wps)}</strong> WPS (words per second)</span>
        });
    },
    render() {
        return ( 
            <div>
                
                <div className={"row justify-content-center " + (this.state.isEntityRevealed ? "":"hidden")}>
                    <div className="col-10 text-center">
                        <div className="clearfix">
                            <ul>
                                <GameClue clue="Pirates of Caribbean" />
                                <GameClue clue="Tourist" />
                                <GameClue clue="Jack Sparrow" />
                                <GameClue clue="Leading Role" />
                                <GameClue clue="Scissorhands" />
                                <GameClue clue="unique style" />
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={"row justify-content-center " + (this.state.isEntityRevealed ? "":"addTopMargin")}  >
                    <div className="col-5 text-center">
                        <div className="clearfix">
                            <p>
                                {this.state.characterElements}
                            </p>
                        </div>
                    </div>
                </div>
                {this.state.isEntityRevealed ? 
                <div className={"row justify-content-center "}  >
                    <div className="col-8 text-center">
                        <div className="row justify-content-center">
                            <Candidate name="Johnny Depp" number={1} correctAnswer={this.state.correctAnswer} onCandidateSelection={this.handleCandidateSelection}/>
                            <Candidate name="Johnny Cash" number={2} correctAnswer={this.state.correctAnswer} onCandidateSelection={this.handleCandidateSelection}/>
                        </div>
                        <div className="row justify-content-center">
                            <Candidate name="Johnny Chase" number={3} correctAnswer={this.state.correctAnswer} onCandidateSelection={this.handleCandidateSelection}/>
                            <Candidate name="Johnny Belushi" number={4} correctAnswer={this.state.correctAnswer} onCandidateSelection={this.handleCandidateSelection}/>
                        </div>
                        <div className="row justify-content-center">
                            <h5>Press the number to select candidate!</h5>
                        </div>
                    </div>
                </div>
                :
                ""
                }
                
                <div className="row justify-content-center margin-top-10">
                    <div className="col-4 text-center">
                        {this.state.previousWord} &nbsp;
                        {this.state.currentWord} &nbsp;
                        {this.state.nextWord}
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-4 text-center">
                        {this.state.stats}
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
                <div className={this.state.didFinishRound ? "":"hidden"}>
                    <SpaceActionBtn />
                </div>
            </div>
        );
    }
});
EntityRevealScreen.propTypes = {
  words: PropTypes.array.isRequired,
  onFinishWave: PropTypes.func.isRequired,
  changeScreenNr: PropTypes.func.isRequired
};

var styles = {
    addTopMargin: {
        marginTop: '20%'
    },
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

module.exports = EntityRevealScreen;
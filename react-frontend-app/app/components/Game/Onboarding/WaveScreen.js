var React = require('react');
    PropTypes = React.PropTypes;
    SpaceActionBtn = require('../SpaceActionBtn'),
    calculateWPM = require('../../../utils/globalFunctions').caluclateWPM,
    GamePoint = require('../Gameplay/GamePoint'),
    assetsDir = require('../../../utils/constatns').assets;

var WaveScreen = React.createClass({
    getInitialState: function() {
        return {
            started: false,
            startTimespan: null,
            currentWordIndex: 0,
            currentWord:    <button className="btn sbold btn-circle btn-lg animated zoomIn">{this.props.words[0]}</button>,
            previousWord:   "",
            nextWord:       <button className="btn sbold btn-circle btn-xs grey-salsa animated zoomIn">{this.props.words[1]}</button>,
            inputText: "",
            stats: "",
            hideInputField: "",
            hideActionBtn: "hidden",
            showGamePoint: null,
        }
    },
    hanldeFastType(e) {
        if(e.keyCode == 32) {
            var currentText = this.state.inputText.trim();
            var displayWord = this.props.words[this.state.currentWordIndex];
            if(currentText === displayWord) {
                //Display Next Word
                nextIndex = this.state.currentWordIndex + 1;
                
                if(nextIndex >= this.props.words.length) {
                    this.setState({
                        currentWord: <img src="app/assets/img/thumbsup.png" width="20%" />,
                        previousWord: "",
                        nextWord: "",
                        inputText: "",
                        hideInputField: "hidden",
                        hideActionBtn: "",
                        currentWordIndex: nextIndex,
                        showGamePoint: <GamePoint point={10} isOnboardingPoint={true}/>
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
                this.playAudio("check-right");
            } else {
                //make a red background 
                this.playAudio("check-wrong");
                this.setState({
                    currentWord: <button className="btn sbold btn-circle btn-lg red-mint animated shake">{this.props.words[this.state.currentWordIndex]}</button>,
                    inputText: currentText
                });
            }
        } else {
            this.setState({
                currentWord: <button className="btn sbold btn-circle btn-lg">{this.props.words[this.state.currentWordIndex]}</button>
            });
        }
    },
    handleChange(event) {
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
        var wpm = calculateWPM(this.state.currentWordIndex + 1, stoptime, this.state.startTimespan);
        this.setState({
            stats: <span>Your Speed: <strong>{Math.round(wpm)}</strong> WPM (words per minute)</span>,
            showGamePoint: <GamePoint point={10} isOnboardingPoint={true}/>
        });
        this.props.changeScreenNr(2);
        this.props.setPlayerStats({'wpm': wpm});
    },
    playAudio(soundID) {
        var audio = document.getElementById(soundID);		
        audio.play();
    },
    render() {
        return ( 
            <div>
                <div className="row justify-content-center animated zoomIn" style={styles.centerIt}>
                    <div className="col-4 text-center">
                        <h4 className="animated fadeInUp">
                            Type the words below as fast as you can. Start typing when ready!
                        </h4>
                    </div>
                </div>
                <div className="row justify-content-center margin-top-10">
                    <div className="col-4 text-center">
                        <audio src="https://s3.amazonaws.com/freecodecamp/simonSound2.mp3" id="check-right"></audio>
                        <audio src={assetsDir+"/audio/Button-sound-wrong.mp3"} id="check-wrong"></audio>
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
                <div className={"row justify-content-center margin-top-10 "+this.state.hideInputField}>
                    <div className="col-4 text-center">
                        <div className="form-group form-md-line-input has-success animated fadeInUp">
                            <input className="form-control input-lg" autoFocus value={this.state.inputText} onChange={this.handleChange} onKeyDown={this.hanldeFastType} type="text"/>
                            <label htmlFor="form_control_1"></label>
                        </div>
                    </div>
                </div>
                <div className={this.state.hideActionBtn}>
                    <SpaceActionBtn command="SPACE" message="Hit SPACE to Continue" animation="animated bounce infinite" divSize={12}/>
                </div>

                {this.state.showGamePoint}
            </div>
        );
    }
});
WaveScreen.propTypes = {
  words: PropTypes.array.isRequired,
  onFinishWave: PropTypes.func.isRequired,
  changeScreenNr: PropTypes.func.isRequired,
  setPlayerStats: PropTypes.func.isRequired
};

var styles = {
    centerIt: {
        marginTop: '20%'
    }
}

module.exports = WaveScreen;
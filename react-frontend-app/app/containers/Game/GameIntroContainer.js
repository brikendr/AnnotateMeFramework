var React = require('react');
require('../../styles/animate.css');
var GameHelper = require('../../utils/GameHelper');
var GameLoadingGif =  require('../../assets/img/gameloading.gif')

var GameIntroContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            currentWordIndex: 0,
            words:["game secret", "userame", "personal secret"],
            currentWord:    <button className="btn sbold btn-circle btn-lg animated zoomIn">game secret</button>,
            previousWord:   "",
            nextWord:       <button className="btn sbold btn-circle btn-xs grey-salsa animated zoomIn">userame</button>,
            inputText: "",
            gameSecret: "",
            username: "",
            password: "",
            isAuthenticating: false,
            infoMessage: <span className="font-blue-soft font-sm sbold">Type Secret Combo!</span>
        }
    },
    handleKeyPress(e) {
        if(e.ctrlKey && e.keyCode == 32) {
            this.redirectGame('/aboardIntro');
        } 
        else if(e.keyCode == 32) {
            var nextIndex = this.state.currentWordIndex + 1;
            if(nextIndex >= this.state.words.length) {
                this.setState({
                    currentWord:    <button className="btn sbold btn-circle btn-xs green-jungle animated slideInRight">{this.state.words[nextIndex - 1]}</button>,
                    inputText: "",
                    isAuthenticating: true
                });
                GameHelper.authenticateUser(this.state.username, this.state.password)
                .then(function(response){
                    console.log(response);
                    if (response.status == 200 && this.state.gameSecret.toUpperCase() == "FIGHTCLUB") {
                        alert('Authentication passed!');
                    } else {
                        this.setState(this.getInitialState());
                        this.setState({
                            infoMessage: <span className="font-red-thunderbird font-sm sbold">Authentication Failed!</span>,
                            isAuthenticating: false
                        });
                    }
                }.bind(this));
            } else {
                this.setState({
                    currentWord:    <button className="btn sbold btn-circle btn-lg animated slideInRight">{this.state.words[nextIndex]}</button>,
                    previousWord:   <button className="btn sbold btn-circle btn-xs green-jungle animated slideInRight">{this.state.words[nextIndex - 1]}</button>,
                    nextWord:       nextIndex == 2 ? "":<button className="btn sbold btn-circle btn-xs grey-salsa animated slideInRight">{this.state.words[nextIndex + 1]}</button>,
                    inputText: "",
                    currentWordIndex: nextIndex
                }); 
            }
        } else {
            this.setState({
                currentWord: <button className="btn sbold btn-circle btn-lg">{this.state.words[this.state.currentWordIndex]}</button>
            });
        }
    },
    redirectGame(path) {
        this.context.router.push(path);
        document.removeEventListener("keydown", this.handleKeyPress);
    },
    handleChange(event) {
        if(this.state.currentWordIndex == 0) {this.setState({gameSecret: event.target.value});} 
        else if(this.state.currentWordIndex == 1) {this.setState({username: event.target.value});}
        else if(this.state.currentWordIndex == 2) {this.setState({password: event.target.value});}
        this.setState({
            inputText: event.target.value
        });
    },
    componentWillMount:function(){
        document.addEventListener("keydown", this.handleKeyPress);
    },
    render() {
        return (
            <div className="container">
                <div className="row justify-content-center animated fadeInDown" style={styles.centerIt}>
                    <div className="col-4 text-center">
                        <img className="display-img-center" src="app/assets/img/openeyes.jpeg" width="100%"/>
                        <h2 className="animated fadeInUp">{this.state.infoMessage}</h2>
                    </div>
                </div>
                

                {this.state.isAuthenticating ?
                <div className="row justify-content-center margin-top-0 animated zoomIn" >
                    <div className="col-4 text-center">
                        <img className="display-img-center" src={GameLoadingGif} width="100%"/>
                    </div>
                </div>
                :
                <div>
                    <div className="row justify-content-center margin-top-10">
                        <div className="col-8 text-center">
                            {this.state.previousWord} &nbsp;
                            {this.state.currentWord} &nbsp;
                            {this.state.nextWord}
                        </div>
                    </div>
                    <div className="row justify-content-center margin-top-10">
                        <div className="col-4 text-center">
                            
                            <div className="form-group form-md-line-input has-success animated fadeInUp">
                                <input className="form-control input-lg" autoFocus value={this.state.inputText.trim()} onChange={this.handleChange} onKeyDown={this.hanldeFastType} type={this.state.currentWordIndex == 2 ? "password":"text"}/>
                                <label htmlFor="form_control_1"></label>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center margin-top-0 animated fadeInUp" >
                        <div className="col-4 text-center">
                            <p><span className="badge badge-info badge-roundless animated bounce infinite"> New ? </span> <strong>Press <span className="font-red-thunderbird sbold">Ctrl + Space</span></strong></p>
                        </div>
                    </div>
                </div>
                }
                
            </div>
        );
    }
});
var styles = {
  centerIt: {
    marginTop: '15%'
  },
  disclaimerFooter: {
    display: 'block',
    margin: '0 auto'
}
}

module.exports = GameIntroContainer;
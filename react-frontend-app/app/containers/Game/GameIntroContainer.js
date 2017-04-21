var React = require('react'),
    PropTypes = React.PropTypes,
    GameHelper = require('../../utils/GameHelper'),
    GameLoadingGif =  require('../../components/Game/GameLoadingGif'),
    ReactRedux = require("react-redux"),
    actions = require('../../redux/actions/authActions');

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
            infoMessage: <span className="font-blue-soft font-sm sbold">Want to play! Type the secret combinations!</span>
        }
    },
    propTypes:{
        authenticatedUser: PropTypes.object.isRequired,
        userAuthenticated: PropTypes.func.isRequired
    },
    componentWillMount:function(){
        document.addEventListener("keydown", this.handleKeyPress);
    },
    componentDidMount() {
        if(this.props.authenticatedUser.authenticated) {
            //SEND TO Home page
            this.redirectGame('fasttype/home');
        }
    },
    handleKeyPress(e) {
        if(e.ctrlKey && e.keyCode == 32) {
            this.redirectGame('aboardIntro');
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
                    if (response.status == 200 && this.state.gameSecret.toUpperCase() == "FIGHTCLUB") {
                        this.props.userAuthenticated(response.resource);
                        this.redirectGame('fasttype/home');
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
                <GameLoadingGif />
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
                            <p><span className="badge badge-info badge-roundless animated bounce infinite"> New ? </span> <strong>Wanna know the game secret? <br/>Press <span className="font-red-thunderbird sbold">Ctrl + Space</span> to find out!</strong></p>
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

// connect to Redux store
var mapStateToProps = function(state){
    // This component will have access to `appstate.heroes` through `this.props.heroes`
    return {authenticatedUser: state.user};
};

var mapDispatchToProps = function(dispatch){
    return {
        userAuthenticated: function(jsonData){ dispatch(actions.userAuthenticated(jsonData)); }
    }
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(GameIntroContainer);
//module.exports = GameIntroContainer;
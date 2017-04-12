var React = require('react');
var PropTypes = React.PropTypes;
var SpaceActionBtn = require('../SpaceActionBtn');

var RewardScreen = React.createClass({
    getInitialState: function() {
        return {
            emailAnimation: "animated fadeInUp",
            passwordAnimation: "animated fadeInUp",
            email: "",
            password: ""
        }
    },
    componentDidMount() {
        document.addEventListener("keydown", this.handleLocalSpacePress, false);
    },
    handleLocalSpacePress(e) {
        if(e.ctrlKey && e.keyCode == 32){
            if(this.state.email.trim() == ""){
                this.setState({
                    emailAnimation: "animated shake"
                });
            }
            else if(this.state.password.trim() == ""){
                this.setState({
                    passwordAnimation: "animated shake"
                });
            } else {
                //TODO: Register user then redirect, plus stats
                console.log('CHANGING SCREEN TO 6');
                this.props.redirectHome();
            }
        }
    },
    generateStats(stoptime){
        this.props.changeScreenNr(3);
    },
    handleEmailChange(event){
        this.setState({
            email: event.target.value
        });
    },
    handlePassChange(event){
        this.setState({
            password: event.target.value
        });
    },
    render() {
        return ( 
            <div>
                <div className="row justify-content-center animated zoomIn" style={styles.centerIt}>
                    <div className="col-xs-6  text-center">
                        <div className="mt-element-ribbon bg-grey-steel">
                            <div className="ribbon ribbon-border-hor ribbon-clip ribbon-color-danger uppercase">
                                <div className="ribbon-sub ribbon-clip"></div> YAY!!!!!! YOU DID IT! </div>
                            <p className="ribbon-content">Good Job for killing those keyboard keys! <br /> Behold, the secret word to the game</p>
                            <br />
                            <h6>(psst, never talk about <strong>fightclub</strong>)</h6>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-4 text-center">
                        <h3> Password: <strong>fightclub</strong></h3>
                    </div>
                </div>
                <div className={"row justify-content-center margin-top-10"}>
                    <div className="col-4">
                        <div className={"form-group form-md-line-input has-success " + this.state.emailAnimation}>
                            <input className="form-control input-lg" autoFocus placeholder="Your E-mail" type="email" value={this.state.email} onChange={this.handleEmailChange}/>
                        </div>
                    </div>
                </div>
                <div className={"row justify-content-center margin-top-10"}>
                    <div className="col-4">
                        <div className={"form-group form-md-line-input has-success " + this.state.passwordAnimation}>
                            <input className="form-control input-lg" placeholder="Secret Keyword" type="password" value={this.state.password} onChange={this.handlePassChange}/>
                        </div>
                    </div>
                </div>
                <SpaceActionBtn message="Fill in all fields, Press CTRL + SPACE to continue!" />
            </div>
        );
    }
});
RewardScreen.propTypes = {
  onFinishWave: PropTypes.func.isRequired,
  redirectHome: PropTypes.func.isRequired
};

var styles = {
    centerIt: {
        marginTop: '20%'
    }
}

module.exports = RewardScreen;
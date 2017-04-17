var React = require('react'),
    PropTypes = React.PropTypes,
    assetsDir = require('../../../utils/constatns').assets;

var ChallengeIntro = React.createClass({
    getInitialState: function() {
        return {
            animation: "animated zoomIn"
        }
    },
    componentDidMount() {
        setTimeout(function(){
            this.setState({animation: "animated flipOutY"});
        }.bind(this), 3000);
        setTimeout(function(){
            this.props.onGameStateChange("PLAYING");
        }.bind(this), 3700);
    },
    render() {
        return (
            <div className={"row justify-content-center marginTop5 " + this.state.animation}>
                <div className="col-md-2">
                    <div className="mt-widget-1" style={{border: 'none'}}>
                        <div className="mt-img border-green-jungle" style={{margin: '5px'}}>
                            <img src={assetsDir + "img/game-avatar.png"} width="60px"/> 
                        </div>
                        <div className="mt-body">
                            <h5>YOU</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <p className="stats__amount text-center font-green-sharp" style={{fontSize: "2em"}}> VS. </p>
                </div>
                <div className="col-md-2">
                    <div className="mt-widget-1" style={{border: 'none'}}>
                        <div className="mt-img border-red-mint" style={{margin: '5px'}}>
                            <img src={assetsDir + "img/game-avatar.png"} width="60px"/> 
                        </div>
                        <div className="mt-body">
                            <h5>{this.props.challenger}</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="stats stats--main font-green-haze">
                        <div className="stats__caption">To Beat:</div>
                        <div className="stats__amount">{this.props.challengedWPM + " WPM"}</div>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="stats stats--main font-green-haze">
                        <div className="stats__caption">Challenged Points:</div>
                        <div className="stats__amount">{this.props.challengedPoints + " Points"}</div>
                    </div>
                </div>
            </div>
        );
    }
})

ChallengeIntro.propTypes = {
    onGameStateChange: PropTypes.func.isRequired,
    challengee: PropTypes.object.isRequired,
    challenger: PropTypes.string.isRequired,
    challengedWPM: PropTypes.number.isRequired,
    challengedPoints: PropTypes.number.isRequired
};

module.exports = ChallengeIntro;
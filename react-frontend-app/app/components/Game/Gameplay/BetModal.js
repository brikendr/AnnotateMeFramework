var React = require('react'),
    PropTypes = React.PropTypes,
    SpaceBtn = require('../../../components/Game/SpaceActionBtn');

var BetModal = React.createClass({
    componentDidMount() {
        require('../../../styles/modalStyle.css');
        require('../../../styles/slider.css');
    },
    render(){
        return (
        <div className="modal-wrapper">
            <div className="modal" style={{height: '520px'}}>
                <div className="head">
                    <h3 className="bold font-white">Betting Time!</h3>
                    <h5 className="font-white">Press ESC to exit</h5>
                </div>
                <div className="content">
                        <h4 className="font-green-haze"> <strong>Feeling confident about your answer?</strong></h4>
                        <h5>Bet 0-10 points below, If other players select the same answer as you, the points are yours.</h5>
                        <h5> <strong>NOTE</strong>: If players have agreed for a different option, you loose the points! </h5>
                        <div className="clear">
                            <div className="box" style={{background: 'none', width: '100%'}}>
                                <div className="box__body">
                                    <div className="stats stats--main font-green-haze">
                                        <div className="stats__amount">
                                            <form>
                                                <input type="range" value={this.props.points}/>
                                                <h5 className="bold uppercase">{this.props.points / 10 + (this.props.points > 10 ? " Points":" Point")} </h5>
                                            </form>
                                        </div>
                                        <h4 className="font-dark">Use Left - Right arrow to change value</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <SpaceBtn command="CTRL + SPACE" message="Register BET" divSize={12}/>
                </div>
            </div>
        </div>
    );
    }
});

BetModal.propTypes = {
  handleCandidateSelection: PropTypes.func.isRequired,
  points: PropTypes.number.isRequired
};

module.exports = BetModal;
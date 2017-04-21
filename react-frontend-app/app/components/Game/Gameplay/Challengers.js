var React = require('react'),
    PropTypes = React.PropTypes,
    assetsDir = require('../../../utils/constatns').assets;

var Challengers = React.createClass({
    getInitialState: function() {
        return {
            currentStatus: "grey-salsa",
            annimation: "",
            isSelected: false
        }
    },
    componentDidMount() {
        document.addEventListener("keydown", this.localCandidateSelectionHandler);
    },
    localCandidateSelectionHandler(e){
        if(e.keyCode == (48 + this.props.number)) {
            var isSelected = this.state.isSelected,
                status = isSelected ? "grey-salsa": "green-jungle",
                anim = isSelected ? "flash":"bounce";
            this.setState({
                currentStatus: status,
                annimation: "animated "+anim,
                isSelected: !isSelected
            });

            this.props.toggleChallengerFromList(this.props.challengerId, this.props.wpm);
        }
    },
    render(){
        return (
        <div className="col-md-3">
            <div className="mt-widget-1" style={{border: 'none'}}>
                <div className="mt-icon" >
                    <a href="#">
                        <i className="icon-plus"></i>
                    </a>
                </div>
                <div className={"mt-img border-"+this.state.currentStatus+" " +this.state.annimation} style={{margin: '5px'}}>
                    <img src={assetsDir + "img/game-avatar.png"} width="60px"/> 
                </div>
                <div className="mt-body">
                    <h5>
                        <strong className="bold font-red-mint">[{this.props.number}]</strong>  <br />
                        {this.props.name} <br/> {"(Wpm: "+this.props.wpm+")"}
                    </h5>
                </div>
            </div>
        </div>                                                        
    );
    }
});

Challengers.propTypes = {
  name: PropTypes.string.isRequired,
  wpm: PropTypes.number.isRequired,
  number: PropTypes.number.isRequired,
  challengerId: PropTypes.number.isRequired,
  toggleChallengerFromList: PropTypes.func.isRequired
};

module.exports = Challengers;
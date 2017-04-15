var React = require('react'),
    PropTypes = React.PropTypes;

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

            this.props.toggleChallengerFromList(this.props.number);
        }
    },
    render(){
        return (
        <div className="col-md-2">
            <p className={"gavatar bg-"+this.state.currentStatus+" bg-font-"+ this.state.currentStatus + " " +this.state.annimation}>
                {this.props.wpm}
            </p>
            <h5>{this.props.name}</h5>
        </div>
                                                        
    );
    }
});

Challengers.propTypes = {
  name: PropTypes.string.isRequired,
  wpm: PropTypes.number.isRequired,
  number: PropTypes.number.isRequired,
  toggleChallengerFromList: PropTypes.func.isRequired
};

module.exports = Challengers;
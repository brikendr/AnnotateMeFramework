var React = require('react');
var PropTypes = React.PropTypes;

var Candidate = React.createClass({
    getInitialState: function() {
        return {
            hasUserSelected: false,
            currentStatus: "grey-salsa",
            annimation: ""
        }
    },
    componentDidMount() {
        document.addEventListener("keydown", this.props.onCandidateSelection, false);
        document.addEventListener("keydown", this.localCandidateSelectionHandler, false);
    },
    localCandidateSelectionHandler(e){
        if(e.keyCode == (48 + this.props.number)) {
            if(e.keyCode == (48 + this.props.correctAnswer)) {
                //correct answer 
                this.setState({
                    currentStatus: "green-jungle",
                    annimation: "animated bounce"
                });
                 document.removeEventListener("keydown", this, false);
            } else {
                //wrong answer
                this.setState({
                    currentStatus: "red-mint",
                    annimation: "animated shake"
                });
            }
        } else {
            //grey out 
            this.setState({
                currentStatus: "grey-salsa",
                annimation: ""
            });
        }
    },
    render() {
        return (
        <div className={"col-md-4 "+ this.state.annimation}>
            <div className="form-group form-md-line-input">
                <div className="col-md-10">
                    <div className="input-group input-group-sm">
                        <span className="input-group-btn btn-left">
                            <button className={"btn "+ this.state.currentStatus} type="button">{this.props.number}</button>
                        </span>
                        <div className="input-group-control">
                            <strong>{this.props.name}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    }
});

Candidate.propTypes = {
  name: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  correctAnswer: PropTypes.number.isRequired,
  onCandidateSelection: PropTypes.func.isRequired
};

module.exports = Candidate;
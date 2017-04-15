var React = require('react');
var PropTypes = React.PropTypes;

function GameCandidate(props) {
    return (
        <div className={"col-md-6"}>
            <div className="form-group form-md-line-input">
                <div className="col-md-10">
                    <div className="input-group input-group-sm">
                        <span className="input-group-btn btn-left">
                            <button className={"btn "} type="button">{props.number}</button>
                        </span>
                        <div className="input-group-control">
                            <strong>{props.name}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

GameCandidate.propTypes = {
  number: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired
};

module.exports = GameCandidate;
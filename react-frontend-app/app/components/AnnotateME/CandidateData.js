var React = require('react');
var PropTypes = React.PropTypes;
var Portlet = require('./Portlet');
var FancyCandidateDataWrapper = require('./FancyCandidateDataWrapper');

function mapCandidates(candidates) {
    
}

function CandidateData(props) {
    return (
        <Portlet size={3} bordered="bordered">
            <div className="mt-element-list">
                <div className="mt-list-head list-default blue-chambray">
                    <div className="list-head-title-container">
                        <h3 className="list-title uppercase sbold">Candidate List</h3>
                    </div>
                </div>
                <FancyCandidateDataWrapper 
                    candidate="Hello"
                    onSelectCandidate={props.onSelectCandidate}/>
            </div>
        </Portlet>
        
    ); 
}

CandidateData.propTypes = {
    candidates: PropTypes.array.isRequired,
    onSelectCandidate: PropTypes.func.isRequired
}

module.exports = CandidateData;
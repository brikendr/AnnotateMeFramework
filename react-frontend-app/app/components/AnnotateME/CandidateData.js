var React = require('react');
var PropTypes = React.PropTypes;
var Portlet = require('./Portlet');
var FancyCandidateDataWrapper = require('./FancyCandidateDataWrapper');
var NILComponent = require('./NilCandidateComponent');

function mapCandidates(candidates, props) {
    const mappedCandidates = candidates.map(candidate => 
        <FancyCandidateDataWrapper 
            key={candidate.id}
            candidate={candidate}
            onSelectCandidate={props.onSelectCandidate}/>
    );
    return mappedCandidates;
}

function CandidateData(props) {
    let candidates = mapCandidates(props.candidates, props);
    let NilComponent = props.candidates.length > 0 ? <NILComponent onSelectCandidate={props.onSelectCandidate}/> : "";

    return (
        <Portlet size={3} bordered="bordered">
            <div className="mt-element-list">
                <div className="mt-list-head list-default blue-chambray">
                    <div className="list-head-title-container">
                        <h3 className="list-title uppercase sbold">Candidate List</h3>
                    </div>
                </div>
                {candidates}
                {NilComponent}
            </div>
        </Portlet>
        
    ); 
}

CandidateData.propTypes = {
    candidates: PropTypes.array.isRequired,
    onSelectCandidate: PropTypes.func.isRequired
}

module.exports = CandidateData;
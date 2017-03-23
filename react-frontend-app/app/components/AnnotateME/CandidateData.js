var React = require('react');
var PropTypes = React.PropTypes;
var Portlet = require('./Portlet');
var FancyCandidateDataWrapper = require('./FancyCandidateDataWrapper');
var NILComponent = require('./NilCandidateComponent');
var SkipElement = require('./SkipElement');

function mapCandidates(candidates, props) {
    const mappedCandidates = candidates.map(candidate => 
        <FancyCandidateDataWrapper 
            key={candidate.id}
            candidate={candidate}
            onSelectCandidate={props.onSelectCandidate}
            onToggleCollapseCandidate={props.onToggleCollapseCandidate}/>
    );
    return mappedCandidates;
}

function CandidateData(props) {
    let candidates = mapCandidates(props.candidates, props);
    let NilComponent = props.candidates.length > 0 ? <NILComponent onSelectCandidate={props.onSelectCandidate}/> : "";
    let Skip  = <SkipElement onSkipAnnotation={props.onSkipAnnotation} />
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
                {Skip}
            </div>
        </Portlet>
        
    ); 
}

CandidateData.propTypes = {
    candidates: PropTypes.array.isRequired,
    onToggleCollapseCandidate: PropTypes.func.isRequired,
    onSelectCandidate: PropTypes.func.isRequired,
    onSkipAnnotation: PropTypes.func.isRequired
}

module.exports = CandidateData;
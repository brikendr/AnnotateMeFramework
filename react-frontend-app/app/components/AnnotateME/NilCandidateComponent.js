var React = require('react');
var PropTypes = React.PropTypes;
var Portlet = require('./Portlet');

function NilCandidateComponent (props) {
    return (
        <div className="portlet light red-mint margin-top-10" style={{padding: '1px 0px 0px 3px !important'}}>
                <div className="portlet-title">
                    <div className="caption">
                        <label className="mt-checkbox mt-checkbox-outline">
                            <input type="checkbox" value="1" name="test" onChange={(e) => props.onSelectCandidate('NIL', e)}/>
                            <span></span>
                        </label>
                        <span className="caption-subject bold font-white" style={{cursor: 'pointer'}} > Non of the above (NIL) </span>
                    </div>
                </div>
            </div>
    );
}
var styles = {
    thinPortlet: {
        padding: '1px 0px 0px 3px !important'
    }
}
NilCandidateComponent.propTypes = {
    onSelectCandidate: PropTypes.func.isRequired
}
module.exports = NilCandidateComponent;
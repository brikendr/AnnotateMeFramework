var React = require('react');
var PropTypes = React.PropTypes;
var Collapse = require('react-collapse');
var ReactToolTip = require('react-tooltip');
var Utf8 = require('utf8');

var FancyCandidateDataWrapper = React.createClass({
    propTypes: {
        candidate: PropTypes.object.isRequired,
        onToggleCollapseCandidate:  PropTypes.func.isRequired,
        onSelectCandidate: PropTypes.func.isRequired
    },
    getInitialState: function() {
        return {
            collapsedContent: true
        }
    },
    render: function() {
        var description = "";
        try {
            description = Utf8.decode(this.props.candidate.description);
        } catch (e){
            description = this.props.candidate.description;
        }
        return (
            <div className="portlet light green-soft margin-top-10">
                <div className="portlet-title">
                    <div className="caption">
                        <label className="mt-radio mt-radio-outline">
                            <input type="radio" value="1" name="test" onClick={(e) => this.props.onSelectCandidate(this.props.candidate.id, e)}/>
                            <span></span>
                        </label>
                        <span className="caption-subject bold font-white" style={{cursor: 'pointer'}} onClick={(e) => this.props.onToggleCollapseCandidate(this.props.candidate.id, e)} data-tip={this.props.candidate.schema_type}> {this.props.candidate.candidate_name} </span> <ReactToolTip />
                    </div>
                </div>
                <Collapse isOpened={!this.props.candidate.isCollapsed}>
                    <div className="portlet-body">
                        <p> {description} </p>
                        <a href={this.props.candidate.dbpediaURL} target="_blank" className="font-white">DBpedia Link</a>
                    </div>
                </Collapse>
                
            </div>
        );
    }
});

var styles = {
    thinPortlet: {
        padding: '1px 0px 0px 3px !important'
    }
}
module.exports = FancyCandidateDataWrapper;
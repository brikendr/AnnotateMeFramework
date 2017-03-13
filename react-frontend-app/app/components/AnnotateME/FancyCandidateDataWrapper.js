var React = require('react');
var PropTypes = React.PropTypes;
var Collapse = require('react-collapse');
var ReactToolTip = require('react-tooltip');

var FancyCandidateDataWrapper = React.createClass({
    propTypes: {
        candidate: PropTypes.object.isRequired,
        onSelectCandidate: PropTypes.func.isRequired
    },
    getInitialState: function() {
        return {
            collapsedContent: true
        }
    },
    toggleCollapse: function(){
        this.setState({
            collapsedContent: !this.state.collapsedContent
        });
    },
    render: function() {
        return (
            <div className="portlet light green-soft margin-top-10">
                <div className="portlet-title">
                    <div className="caption">
                        <label className="mt-checkbox mt-checkbox-outline">
                            <input type="checkbox" value="1" name="test" onChange={(e) => this.props.onSelectCandidate(this.props.candidate.id, e)}/>
                            <span></span>
                        </label>
                        <span className="caption-subject bold font-white" style={{cursor: 'pointer'}} onClick={this.toggleCollapse} data-tip={this.props.candidate.schema_type}> {this.props.candidate.candidate_name} </span> <ReactToolTip />
                    </div>
                </div>
                <Collapse isOpened={!this.state.collapsedContent}>
                    <div className="portlet-body">
                        <p> {this.props.candidate.description} </p>
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
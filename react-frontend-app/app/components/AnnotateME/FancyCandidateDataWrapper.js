var React = require('react');
var PropTypes = React.PropTypes;
var Collapse = require('react-collapse');

var FancyCandidateDataWrapper = React.createClass({
    propTypes: {
        candidate: PropTypes.string.isRequired,
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
                            <input type="checkbox" value="1" name="test" onChange={this.props.onSelectCandidate}/>
                            <span></span>
                        </label>
                        <span className="caption-subject bold font-white" style={{cursor: 'pointer'}} onClick={this.toggleCollapse}> Candidate 1 </span>
                    </div>
                </div>
                <Collapse isOpened={!this.state.collapsedContent}>
                    <div className="portlet-body">
                        <p> Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget
                            lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet
                            fermentum. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum. consectetur purus sit amet fermentum. Duis mollis, est
                            non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum. </p>
                    </div>
                </Collapse>
                
            </div>
        );
    }
});
module.exports = FancyCandidateDataWrapper;
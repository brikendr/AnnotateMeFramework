var React = require('react');
var PropTypes = React.PropTypes;

var NoteMessage = React.createClass({
    propTypes: {
        text: PropTypes.string.isRequired
    },
    getInitialState: function(){
        this.originalText = this.props.text;
        return {
            text: this.originalText
        }
    },
    render: function() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="portlet light">
                        <div className="portlet-body">
                            <div className="alert alert-success">
                                {this.state.text} 
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        );
    }
});

module.exports = NoteMessage;
var React = require('react');
var Navbar = require('../components/Navbar');
var AdminMainComponent = require('../components/AdminMainComponent');
var NewDocumentForm = require('../components/NewDocumentForm');
var DatastoreHelper = require('../utils/dataStoreHelper');

var NewDocumentContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            path: '',
            text: '',
            dataset: '',
            confidence: '',
            support: '',
            keywords: 4,
            concepts: 2,
            sentanceRestrictered: false
        }
    },
    handleSubmitForm: function(e) {
        e.preventDefault();
        DatastoreHelper.invokeBrooker(this.state)
        .then(function(response) {
            if(response.status == 200) {
                this.context.router.push('/documents');
            } else {
                console.warn(response.msg);
            }
        }.bind(this));
        
    },
    handleInputChange: function(e, results){
        results.forEach(result => {
            const [e, file] = result;
            var previousTxt = this.state.text;
            this.setState({
                text: previousTxt.concat(e.target.result)
            });
        });
    },
    handlePathChange: function(e) {this.setState({path: e.target.value})},
    handleDatasetChange: function(e) {this.setState({dataset: e.target.value})},
    handleConfidenceChange: function(e) {this.setState({confidence: e.target.value})},
    handleSupportChange: function(e) {this.setState({support: e.target.value})},
    handleKeywordNrChange: function(e) {this.setState({keywords: e.target.value})},
    handleConceptNrChange: function(e) {this.setState({concepts: e.target.value})},
    handleToggleCheckbox: function() {this.setState({sentanceRestrictered: !this.state.sentanceRestrictered})},
    render: function() {
        return (
            <div>
                <Navbar authenticated={true}/>
                <AdminMainComponent page="Explore Document">
                    <NewDocumentForm 
                        onSubmitForm={this.handleSubmitForm}
                        onPathChange={this.handlePathChange}
                        onDatasetChange={this.handleDatasetChange}
                        onConfidenceChange={this.handleConfidenceChange}
                        onSupportChange={this.handleSupportChange}
                        onKeywordNrChange={this.handleKeywordNrChange}
                        onConceptNrChange={this.handleConceptNrChange}
                        toggleCheckboxValue={this.handleToggleCheckbox}
                        onInputChange={this.handleInputChange} /> 
                </AdminMainComponent>
            </div>
        );
    }
});

module.exports = NewDocumentContainer;
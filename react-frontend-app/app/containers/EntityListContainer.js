var React = require('react');
var Navbar = require('../components/Navbar');
var AdminMainComponent = require('../components/AdminMainComponent');
var DatastoreHelper = require('../utils/dataStoreHelper');
var EntityList = require('../components/EntityList');

var EntityListContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },getInitialState: function(){
        return {
            fetching: true,
            documentID: null,
            entities: []
        }
    },
    componentDidMount: function() {
        var docID = this.props.routeParams.documentID;
        this.setState({
            documentID: docID
        });

        DatastoreHelper.getDocumentEntities(docID)
        .then(function(docData) {
            this.setState({
               fetching: false,
               entities: docData.EntityMentions
            });
        }.bind(this));
    },
    handleViewAnnotations: function(entityID) {
        this.context.router.push('/documents/' + this.state.documentID + '/entityMentions/' + entityID + '/annotations');
    },
    handleViewCandidates: function(entityID) {
        this.context.router.push('/documents/' + this.state.documentID + '/entityMentions/' + entityID + '/candidates');
    },
    handleViewCollocations: function(entityID) {
        this.context.router.push('/documents/' + this.state.documentID + '/entityMentions/' + entityID + '/collocations');
    },
    render: function() {
        return (
            <div>
                <Navbar authenticated={true}/>
                <AdminMainComponent page="Document Entities">
                    <EntityList 
                        isFetching={this.state.fetching}
                        entities={this.state.entities}
                        onViewCandidates={this.handleViewCandidates}
                        onViewCollocations={this.handleViewCollocations}
                        onViewAnnotations={this.handleViewAnnotations}/>
                </AdminMainComponent>
            </div>
        );
    }
});

module.exports = EntityListContainer;
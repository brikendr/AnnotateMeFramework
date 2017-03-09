var React = require('react');
var Navbar = require('../components/Navbar');
var AdminMainComponent = require('../components/AdminMainComponent');
var DatastoreHelper = require('../utils/dataStoreHelper');
var CandidateList = require('../components/CandidateList');

var CandodateListContainer = React.createClass({
    getInitialState: function(){
        return {
            fetching: true,
            documentID: null,
            entityID: null,
            candidates: []
        }
    },
    componentDidMount: function() {
        var docID = this.props.routeParams.documentID,
            entityID = this.props.routeParams.entityID;
        
        this.setState({
            documentID: docID,
            entityID: entityID
        });

        DatastoreHelper.getEntityCandidates(entityID)
        .then(function(entityData) {
            this.setState({
               fetching: false,
               candidates: entityData.Candidates
            });
        }.bind(this));
    },
    render: function() {
        return (
            <div>
                <Navbar authenticated={true}/>
                <AdminMainComponent page="Entity Candidates">
                    <CandidateList 
                        isFetching={this.state.fetching}
                        candidates={this.state.candidates}/>
                </AdminMainComponent>
            </div>
        );
    }
});

module.exports = CandodateListContainer;
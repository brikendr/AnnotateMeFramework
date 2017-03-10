var React = require('react');
var Navbar = require('../../components/Navbar');
var AdminMainComponent = require('../../components/Admin/AdminMainComponent');
var DatastoreHelper = require('../../utils/dataStoreHelper');
var CollocationList = require('../../components/Admin/CollocationList');

var CollocationListContainer = React.createClass({
    getInitialState: function(){
        return {
            fetching: true,
            documentID: null,
            entityID: null,
            collocations: []
        }
    },
    componentDidMount: function() {
        var docID = this.props.routeParams.documentID,
            entityID = this.props.routeParams.entityID;
        
        this.setState({
            documentID: docID,
            entityID: entityID
        });

        DatastoreHelper.getEntityCollocations(entityID)
        .then(function(entityData) {
            this.setState({
               fetching: false,
               collocations: entityData.Collocations
            });
        }.bind(this));
    },
    render: function() {
        return (
            <div>
                <Navbar authenticated={true}/>
                <AdminMainComponent page="Entity Collocation">
                    <CollocationList 
                        isFetching={this.state.fetching}
                        collocations={this.state.collocations}/>
                </AdminMainComponent>
            </div>
        );
    }
});

module.exports = CollocationListContainer;
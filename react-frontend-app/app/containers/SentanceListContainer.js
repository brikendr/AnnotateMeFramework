var React = require('react');
var Navbar = require('../components/Navbar');
var AdminMainComponent = require('../components/AdminMainComponent');
var DatastoreHelper = require('../utils/dataStoreHelper');
var SentanceList = require('../components/SentanceList');

var SentanceListContainer = React.createClass({
    getInitialState: function(){
        return {
            fetching: true,
            documentID: null,
            sentances: []
        }
    },
    componentDidMount: function() {
        var docID = this.props.routeParams.documentID;
        this.setState({
            documentID: docID
        });

        DatastoreHelper.getDocumentSentances(docID)
        .then(function(docData) {
            this.setState({
               fetching: false,
               sentances: docData.Sentances
            });
        }.bind(this));
    },
    render: function() {
        return (
            <div>
                <Navbar authenticated={true}/>
                <AdminMainComponent page="Document Sentances">
                    <SentanceList 
                        isFetching={this.state.fetching}
                        sentances={this.state.sentances}/>
                </AdminMainComponent>
            </div>
        );
    }
});

module.exports = SentanceListContainer;
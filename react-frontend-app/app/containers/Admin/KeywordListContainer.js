var React = require('react');
var Navbar = require('../../components/Navbar');
var AdminMainComponent = require('../../components/Admin/AdminMainComponent');
var DatastoreHelper = require('../../utils/dataStoreHelper');
var KeywordList = require('../../components/Admin/KeywordList');

var KeywordListContainer = React.createClass({
    getInitialState: function(){
        return {
            fetching: true,
            documentID: null,
            keywords: []
        }
    },
    componentDidMount: function() {
        var docID = this.props.routeParams.documentID;
        this.setState({
            documentID: docID
        });

        DatastoreHelper.getDocumentKeywords(docID)
        .then(function(docData) {
            this.setState({
               fetching: false,
               keywords: docData.Keywords
            });
        }.bind(this));
    },
    render: function() {
        return (
            <div>
                <Navbar authenticated={true}/>
                <AdminMainComponent page="Document Keywords">
                    <KeywordList 
                        isFetching={this.state.fetching}
                        keywords={this.state.keywords}/>
                </AdminMainComponent>
            </div>
        );
    }
});

module.exports = KeywordListContainer;
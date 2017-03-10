var React = require('react');
var Navbar = require('../../components/Navbar');
var AdminMainComponent = require('../../components/Admin/AdminMainComponent');
var DatastoreHelper = require('../../utils/dataStoreHelper');
var DocumentList = require('../../components/Admin/DocumentList');

var DocumentListContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function(){
        return {
            fetching: true,
            documents: []
        }
    },
    componentDidMount: function() {
        DatastoreHelper.getAllDocs()
        .then(function(documents) {
            this.setState({
               fetching: false,
               documents: documents
            });
        }.bind(this));
    },
    handleViewDocument: function(documentID){
        this.context.router.push('/documents/'+documentID);
    },
    render: function() {
        return (
            <div>
                <Navbar authenticated={true}/>
                <AdminMainComponent page="Document List">
                    <DocumentList 
                        isFetching={this.state.fetching}
                        onViewDocument={this.handleViewDocument}
                        documentList={this.state.documents}/>
                </AdminMainComponent>
            </div>
        );
    }
});

module.exports = DocumentListContainer;
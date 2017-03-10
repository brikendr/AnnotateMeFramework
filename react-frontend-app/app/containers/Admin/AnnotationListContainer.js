var React = require('react');
var Navbar = require('../../components/Navbar');
var AdminMainComponent = require('../../components/Admin/AdminMainComponent');
var DatastoreHelper = require('../../utils/dataStoreHelper');
var AnnotationList = require('../../components/Admin/AnnotationList');

var AnnotationListContainer = React.createClass({
    getInitialState: function(){
        return {
            fetching: true,
            documentID: null,
            entityID: null,
            annotations: []
        }
    },
    componentDidMount: function() {
        var docID = this.props.routeParams.documentID,
            entityID = this.props.routeParams.entityID;
        
        this.setState({
            documentID: docID,
            entityID: entityID
        });

        DatastoreHelper.getEntityAnnotations(entityID)
        .then(function(annotations) {
            this.setState({
               fetching: false,
               annotations: annotations
            });
        }.bind(this));
    },
    render: function() {
        return (
            <div>
                <Navbar authenticated={true}/>
                <AdminMainComponent page="Entity Annotations">
                    <AnnotationList 
                        isFetching={this.state.fetching}
                        annotations={this.state.annotations}/>
                </AdminMainComponent>
            </div>
        );
    }
});

module.exports = AnnotationListContainer;
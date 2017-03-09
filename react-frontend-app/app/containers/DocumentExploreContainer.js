var React = require('react');
var Link = require('react-router').Link;
var Navbar = require('../components/Navbar');
var AdminMainComponent = require('../components/AdminMainComponent');

var DocumentExploreContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            documentID: this.props.routeParams.documentID
        }
    },
    render: function() {
        var sentanceLink = "/documents/"+this.state.documentID+"/sentances",
            keywordsLink = "/documents/"+this.state.documentID+"/keywords",
            EntityLink = "/documents/"+this.state.documentID+"/entityMentions";
        return (
            <div>
                <Navbar authenticated={true}/>
                <AdminMainComponent page="Explore Document">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <Link className="dashboard-stat dashboard-stat-v2 blue"  to={sentanceLink} >
                                <div className="visual font-white">
                                    Sentances
                                </div>
                            </Link>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <Link className="dashboard-stat dashboard-stat-v2 red"  to={keywordsLink} >
                                <div className="visual font-white">
                                    Keywords
                                </div>
                            </Link>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <Link className="dashboard-stat dashboard-stat-v2 purple"  to={EntityLink}>
                                <div className="visual font-white">
                                    Entity Mentions
                                </div>
                            </Link>
                        </div>
                    </div>
                </AdminMainComponent>
            </div>
        )
    }
});

module.exports = DocumentExploreContainer;
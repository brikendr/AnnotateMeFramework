var React = require('react');
var Link = require('react-router').Link;
var Navbar = require('./Navbar');
var AdminMainComponent = require('./AdminMainComponent');

var Dashboard = React.createClass({
    render: function() {
        return (
                <div>
                    <Navbar authenticated={true}/>
                    <AdminMainComponent page="Dashboard">
                        <div className="row">
                            <div className="col-lg-3 col-md-3 col-sm-offset-3">
                                <Link className="dashboard-stat dashboard-stat-v2 blue"  to="/documents">
                                    <div className="visual font-white">
                                        Documents
                                    </div>
                                </Link>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                                <Link className="dashboard-stat dashboard-stat-v2 green"  to="/newDocument">
                                    <div className="visual font-white">
                                        NEW Document
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-3 col-md-3 col-sm-offset-3">
                                <Link className="dashboard-stat dashboard-stat-v2 purple"  to="/participants">
                                    <div className="visual font-white">
                                        Participants
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </AdminMainComponent>
                </div>
            )
    }
});

module.exports = Dashboard;
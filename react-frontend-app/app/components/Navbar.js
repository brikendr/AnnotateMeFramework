var React = require('react');
var PropTypes = React.PropTypes;
var Link = require('react-router').Link;


var Navbar = React.createClass({
    propTypes: {
        title: PropTypes.string,
        authenticated: PropTypes.bool
    },
    getDefaultProps: function() {
        return {
            title: 'AnnotateMe',
            authenticated: false
        };
    },
    render: function() {
        return (
            <header className="page-header">
                <nav className="navbar" role="navigation">
                    <div className="container-fluid">
                        <div className="havbar-header">
                            <Link to='/' className="navbar-brand link font-white">
                                {this.props.title}
                            </Link>
                            {!!this.props.authenticated && <Link to='/adminPanel'><span className="pull-right badge">Logout</span></Link>}
                        </div>
                    </div>
                </nav>
            </header>
        );
    }
});

module.exports = Navbar;
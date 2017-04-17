var React = require('react'),
    PropTypes = React.PropTypes,
    Link = require('react-router').Link;

var ChallengeNotification = React.createClass({
    getInitialState: function() {
        return {
            menuShowing: false,
            expanded: ""
        }
    },
    componentDidMount() {
        require('../../../styles/challengeNotificationStyle.css');
    },
    handleMouseEnter(e) {
        var menuShowing = this.state.menuShowing;
        if(!menuShowing) {
            this.setState({menuShowing: true, expanded: "expanded"})
        }
    },
    handleMouseLeave(e){
        var menuShowing = this.state.menuShowing;
        if(menuShowing) {
            this.setState({menuShowing: false, expanded: ""})
        }
    },
    render() {
        return (
            <nav className="navigation">
                <ul className="inner-navigation">
                    <li className="right">
                        <div className={"dropdown-container " + this.state.expanded} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                            <a href="#" data-dropdown="notificationMenu" className="menu-link has-notifications circle bttn">
                                <i className="fa fa-bell"></i>
                                <span className="notification-label notification-label-blue">3</span>
                            </a>
                            <ul className="dropdown moveRightFromPage" name="notificationMenu" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                                <li className="notification-group">
                                    <Link to='/challenge/1'>
                                        <div className="notification-tab">
                                            Ardit challenged you in Arts [43 wpm]
                                        </div>
                                    </Link>
                                    
                                </li>
                                <li className="notification-group">
                                    <div className="notification-tab">
                                        Ardit challenged you in Arts [43 wpm]
                                    </div>
                                </li>
                                <li className="notification-group">
                                    <div className="notification-tab">
                                        Ardit challenged you in Arts [43 wpm] sadsadasdsaasd
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </nav>
        );
    }
});

module.exports = ChallengeNotification;
var React = require('react'),
    PropTypes = React.PropTypes,
    ReactRedux = require("react-redux"),
    GameHelper = require('../../../utils/GameHelper'),
    Link = require('react-router').Link,
    toastr = require('../../../assets/js/plugins/bootstrap-toastr/toastr.min.js');

var ChallengeNotification = React.createClass({
    getInitialState: function() {
        return {
            menuShowing: false,
            mappedChallenges: [],
            expanded: ""
        }
    },
    propTypes:{
        User: PropTypes.object.isRequired
    },
    componentDidMount() {
        require('../../../styles/challengeNotificationStyle.css');        
        
        this.fetchChallenges();
        //TO AVOID COLDSTART: When player finishes his/her first game, create a bot challenge 
        GameHelper.shouldBotChallangePlayer(this.props.User.information.id)
        .then(function(response){
            if(response.resource.shouldBotChallenge) {
                this.fetchChallenges();
            }
        }.bind(this));
    },
    fetchChallenges() {
        //fetch any challenges
        GameHelper.fetchPlayerChallenges(this.props.User.information.id)
         .then(function(response){
            this.mapChallenges(response.resource);
         }.bind(this));
    },
    mapChallenges(challenges) {
        var i = 1;
        const mappedChallenges = challenges.map(challenge => 
            <li key={challenge.id} className="notification-group">
                <Link to={'/challenge/'+challenge.id}>
                    <div className="notification-tab">
                        {challenge.challenger.username} challenged you [To Beat: {challenge.p1_wps} wpm]
                    </div>
                </Link>
                
            </li>              
        );
        this.setState({mappedChallenges: mappedChallenges});
        
        if(challenges.length > 0) {
            setTimeout(function(){
                toastr.options = {
                    "closeButton": false,
                    "debug": false,
                    "positionClass": "toast-bottom-right",
                    "showDuration": "1000",
                    "hideDuration": "1000",
                    "timeOut": "5000",
                    "extendedTimeOut": "1000",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut"
                }
                toastr["info"]("YOU have "+challenges.length+" new "+(challenges.length > 1 ? "challenges":"challenge"), "WELCOME BACK!");
            }.bind(this), 1000);
        }
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
                                <span className="notification-label notification-label-blue">{this.state.mappedChallenges.length}</span>
                            </a>
                            <ul className="dropdown moveRightFromPage" name="notificationMenu" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                                {this.state.mappedChallenges}
                            </ul>
                        </div>
                    </li>
                </ul>
            </nav>
        );
    }
});

// connect to Redux store
var mapStateToProps = function(state){
    // This component will have access to `appstate.heroes` through `this.props.heroes`
    return {User: state.user};
};
module.exports = ReactRedux.connect(mapStateToProps)(ChallengeNotification);
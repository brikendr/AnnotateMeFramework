require('../../../styles/challengeNotificationStyle.css');
var React = require('react'),
    PropTypes = React.PropTypes;

function ChallengeNotification(props) {
    return (
        <div className="challengeNav topcorner">
            <input type="checkbox" id="navtoggle"/>
            <div className="toggleNotifications">
                <div className="count">
                    <div className="num">1</div>
                </div>
                <label className="show font-white" htmlFor="navtoggle"><i className="fa fa-bell"></i></label>
                <div className="notifications">
                    <div className="btnbar">
                        <div className="text full font-white">You've been challenged!</div>
                    </div>
                    <div className="groupofnotes font-white">
                        <div className="note">Ardit challenged you in Arts</div>
                    </div>
                    <div className="groupofnotes font-white">
                        <div className="note">Ardit challenged you in Arts</div>
                    </div>
                    <div className="groupofnotes font-white">
                        <div className="note">Ardit challenged you in Arts</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

module.exports = ChallengeNotification;
var React = require('react'),
    PropTypes = React.PropTypes,
    assetsDir = require('../../../utils/constatns').assets;

function LeaderboardPlayer(props) {
    var font = props.isSelf ? "font-white" : "",
        buttonColor = props.isSelf ? "white": "green",
        style = props.isSelf ? "self-leaderboard-player": "";
    return (
        <div className={"mt-actions animated flipInX " + style} >
            <div className="mt-action ">
                <div className="mt-action-img">
                    <img src={assetsDir + "img/game-avatar.png"} width="41px" /> 
                </div>
                <div className="mt-action-body">
                    <div className="mt-action-row">
                        <div className="mt-action-info ">
                            <div className="mt-action-details ">
                                <span className={"mt-action-author pull-left "+ font}>{props.name}</span>
                                <br />
                                <p className={"mt-action-desc" + font}>{props.level}</p>
                            </div>
                        </div>
                        <div className="mt-action-buttons ">
                            <button type="button" className={"btn btn-circle "+ buttonColor +" btn-outline"}>{props.wpm} WPM</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
var styles = {
    selfPlayer: {
        background: '-webkit-radial-gradient(ellipse farthest-corner at center top, #f39264 0%, #f2606f 100%)!important',
        background: 'radial-gradient(ellipse farthest-corner at center top, #f39264 0%, #f2606f 100%)!important'
    }
}

LeaderboardPlayer.propTypes = {
  name: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
  wpm: PropTypes.number.isRequired,
  isSelf: PropTypes.bool
};

module.exports = LeaderboardPlayer;
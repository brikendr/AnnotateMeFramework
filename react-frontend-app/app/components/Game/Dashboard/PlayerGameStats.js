require('../../../styles/playerStats.css');
var React = require('react'),
    PropTypes = React.PropTypes;

function PlayerGameStats(props) {
    console.log(props.player);
    return (
        <div className="box">
            <div className="box__header">
                <h3 className="box__header-title">Game Statistics [{props.player.username}]</h3>
            </div>
            <div className="box__body">
                <div className="stats stats--main">
                    <div className="stats__amount">{props.wps}</div>
                    <div className="stats__caption">WPS (words per minute)</div>
                </div>
                <div className="stats stats--main">
                    <div className="stats__amount">{props.points}</div>
                    <div className="stats__caption">Points</div>
                </div>

                <div className="stats">
                    <div className="stats__amount" style={{fontSize: '25px'}}>
                        <div className="stats__period">Current Level</div>
                        {props.levelName}
                    </div>
                    <div className="progress progress-striped active">
                        <div className="progress-bar progress-bar-success green-sharp" role="progressbar" aria-valuenow={props.progress} aria-valuemin="0" aria-valuemax="100" style={{width: props.progress+"%"}}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
PlayerGameStats.propTypes = {
    wps: PropTypes.number.isRequired,
    points: PropTypes.number.isRequired,
    levelName: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    player: PropTypes.object.isRequired
}
module.exports = PlayerGameStats;
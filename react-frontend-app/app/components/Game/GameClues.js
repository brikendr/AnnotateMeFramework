var React = require('react');
var PropTypes = React.PropTypes;

function GameClues(props) {
    return (
        <li>
        <span>
            <p>{props.clue}</p>
        </span>
        </li>
    );
}

GameClues.propTypes = {
  clue: PropTypes.string.isRequired
};

module.exports = GameClues;
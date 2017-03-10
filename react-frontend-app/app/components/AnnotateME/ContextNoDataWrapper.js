var React = require('react');
var PropTypes = React.PropTypes;

function ContextNoDataWrapper(props) {
    return (
        <li className="mt-list-item done">
            <div className="list-item-content">
                <p style={{color: 'red'}}>No Data!</p>
            </div>
        </li>
    );
}

module.exports = ContextNoDataWrapper;
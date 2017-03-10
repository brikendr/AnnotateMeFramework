var React = require('react');
var PropTypes = React.PropTypes;

function FancyContextDataWrapper(props) {
    return (
        <div className="mt-list-container list-default ext-1 group">
            <a className="list-toggle-container" >
                <div className="list-toggle done uppercase"> {props.containerName}
                </div>
            </a>
            <div className="panel-collapse">
                <ul>
                    {props.children}
                </ul>
            </div>
        </div>
    );
}


FancyContextDataWrapper.propTypes = {
    containerName: PropTypes.string.isRequired
}

module.exports = FancyContextDataWrapper;
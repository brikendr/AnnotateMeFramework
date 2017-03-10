var React = require('react');
var PropTypes = React.PropTypes;

function Portlet(props) {
    var divsize = "col-md-" + props.size,
        type = props.type != null ? props.type : "light",
        portletType = "portlet " + type + " " + props.bordered;
    return (
        <div className={divsize}>
            <div className={portletType}>
                <div className="portlet-body">
                    {props.children}
                </div>
            </div>
        </div>
    );
}

Portlet.propTypes = {
    size: PropTypes.number.isRequired,
    type: PropTypes.string,
    bordered: PropTypes.string
}

module.exports = Portlet;
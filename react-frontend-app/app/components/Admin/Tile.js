var React = require('react');
var PropTypes = React.PropTypes;
var Link = React.Link;

var Tile = React.createClass({
    propTypes: {
        text: PropTypes.string.isRequired,
        redirectLink: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        offset: PropTypes.string,
        size: PropTypes.number.isRequired
    },
    render: function() {
        return (
            <div className={"col-lg-"+this.props.size+" col-md-"+this.props.offset}>
                <Link className={"dashboard-stat dashboard-stat-v2 "+this.props.color}  to={this.props.redirectLink}>
                    <div className="visual font-white">
                        {this.props.text}
                    </div>
                </Link>
            </div>  
        );
    }
});

module.exports = Tile;
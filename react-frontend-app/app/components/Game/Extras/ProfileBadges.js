var React = require('react'),
    PropTypes = React.PropTypes,
    assetsDir = require('../../../utils/constatns').assets;

function ProfileBadges(props) {
    return (
        <div className="col-md-2">
            <div className="mt-widget-1" style={{border: 'none'}}>
                <div className="mt-icon" >
                    <a href="#">
                        <i className="icon-plus"></i>
                    </a>
                </div>
                <div className="mt-img" style={{margin: '5px'}}>
                    <img src={assetsDir + "img/badge_icon.png"} width="60px"/> 
                </div>
                <div className="mt-body">
                    <h5>{props.badgeName}</h5>
                </div>
            </div>
        </div>
    );
}

ProfileBadges.propTypes = {
  badgeName: PropTypes.string.isRequired
};

module.exports = ProfileBadges;
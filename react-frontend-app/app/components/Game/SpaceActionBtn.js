var React = require('react');
var PropTypes = React.PropTypes
    assetsDir = require('../../utils/constatns').assets;

function SpaceActionBtn(props) {
    return (
        <div className={props.divSize == null ? "col-md-6":"col-md-"+props.divSize}>
            <div className="form-actions">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <p className="text-display">{props.command == null ? "SPACE":props.command}</p>
                        <h5>{props.message == null ? "Hit Space to Continue":props.message}</h5>
                    </div>
                </div>
            </div>
        </div>
    );
}

module.exports = SpaceActionBtn;
var React = require('react');
var PropTypes = React.PropTypes;

function SpaceActionBtn(props) {
    return (
        <div>
            <div className="row justify-content-center animated fadeInDown margin-top-10">
                <div className="col-4">
                    <img src="app/assets/img/spacebar.png" width="100%"/>
                    
                </div>
            </div>
            <div className="row justify-content-center animated bounce">
                <div className="col-4 text-center">
                    {props.message == null ? "Hit Space to Continue":props.message}
                </div>
            </div>
        </div>
    );
}

module.exports = SpaceActionBtn;
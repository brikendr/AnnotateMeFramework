var React = require('react'),
    PropTypes = React.PropTypes,
    assetsDir = require('../../utils/constatns').assets;

function GameLoadingGif(props) {
    return (
        <div className="row justify-content-center margin-top-0 animated zoomIn" >
            <div className="col-4 text-center">
                <img className="display-img-center" src={assetsDir + "img/gameloading.gif"} width="100%"/>
            </div>
        </div>
    );
}

module.exports = GameLoadingGif;
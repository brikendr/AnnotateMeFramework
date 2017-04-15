var React = require('react');
var PropTypes = React.PropTypes;
var SpaceActionBtn = require('../SpaceActionBtn');

function CategoryTile(props) {
    return ( 
        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12 animated zoomIn">
            <div className="dashboard-stat2 bordered">
                <div className="display">
                    <div className="number">
                        <h3 className="font-green-sharp">
                            <span> <small><strong>[{props.keyCode}]</strong> &nbsp;<span className="font-dark">{props.categoryName}</span></small></span>
                        </h3>
                    </div>
                    <div className="icon">
                        <i className={"fa " + props.icon} aria-hidden="true"></i>
                    </div>
                </div>
                <div className="progress-info">
                    <div className="progress progress-striped active">
                        <div className="progress-bar progress-bar-success green-sharp" role="progressbar" aria-valuenow={props.progress} aria-valuemin="0" aria-valuemax="100" style={{width: props.progress+"%"}}></div>
                    </div>
                    <div className="status">
                        <div className="status-title"> progress </div>
                        <div className="status-number"> {props.progress}% </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

CategoryTile.PropTypes = {
    progress: PropTypes.number.isRequired,
    categoryName: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    keyCode: PropTypes.number.isRequired
}

module.exports = CategoryTile;
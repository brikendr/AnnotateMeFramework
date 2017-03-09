var React = require('react');
var styles = require('../styles');


function MainContainer(props) {
    return (
        <div className="page-content">
            <div className="container">
                <div className="center-wrap">
                    <div className="center-align">
                        <div className="center-body">
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

module.exports = MainContainer;
var React = require('react');
var styles = require('../styles');


function AdminMainComponent(props) {
    return (
        <div className="container-fluid">
            <div className="page-content page-content-popup">
                <div className="page-content-fixed-header">
                    <ul className="page-breadcrumb">
                        <li>
                            <a href="javascript:void(0)">{props.page}</a>
                        </li>
                    </ul>
                </div>
                <div className="page-content">
                    {props.children}
                </div>
            </div>
        </div>
                
    );
}

module.exports = AdminMainComponent;
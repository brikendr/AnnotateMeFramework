var React = require('react');
var PropTypes = React.PropTypes;
require('../assets/js/datatables.bootstrap');
require('../assets/js/datatables-managed');
require('../styles/datatables.bootstrap.css');

function Datatable(props) {
    return (
        <div className="row">
            <div className="col-md-12">
                <div className="portlet light bordered">
                    <div className="portlet-title">
                        <div className="caption font-dark">
                            <i className="icon-settings font-dark"></i>
                            <span className="caption-subject bold uppercase"> {props.tableName} </span>
                        </div>
                    </div>
                    <div className="portlet-body">
                        <table className="table table-striped table-bordered table-hover table-checkable order-column" id="sample_1">
                            {props.children}
                        </table> 
                    </div>
                </div>
            </div>
        </div>   
    );
}

Datatable.propTypes = {
    tableName: PropTypes.string.isRequired
}

module.exports = Datatable;
var React = require('react');
var PropTypes = React.PropTypes;
var Portlet = require('./Portlet');

function MainEntityData (props) {
    return (
        <div className="col-md-6">
            <div className="row" >
                <div className="col-sm-6 col-sm-offset-3" style={styles.entityMention}>
                    <div className="caption text-center">
                        <span className="caption-subject font-green bold uppercase" style={styles.entityFont}>Resolve Entity Below </span>
                    </div>
                    <div className="mt-element-step" style={styles.stepElement}>
                        <div className="row step-default ">
                            <div className="col-md-12 bg-grey mt-step-col error">
                                <div className="mt-step-number first bg-white font-grey">{props.annotatedEntities}</div>
                                <div className="mt-step-content font-grey-cascade" style={styles.entityFont}>{props.entityName}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}
var styles = {
    entityMention: {
        paddingTop: '15%'
    },
    entityFont: {
        fontSize: '20px'
    },
    stepElement: {
        padding: '5%'
    }
}

MainEntityData.propTypes = {
    entityName: PropTypes.string.isRequired,
    annotatedEntities: PropTypes.number.isRequired
}

module.exports = MainEntityData;
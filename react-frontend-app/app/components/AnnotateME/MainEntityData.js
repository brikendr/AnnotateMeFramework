var React = require('react');
var PropTypes = React.PropTypes;

function MainEntityData (props) {
    return (
        <div className="col-md-6">
            <div className="row" >
                <div className="col-sm-6 col-sm-offset-3" style={styles.entityMention}>
                    <div className="caption text-center">
                        <span className="caption-subject font-green bold uppercase" style={styles.descriptionFont}>
                            {   props.entityObject != null 
                            ?   "Resolve Entity Below"
                            :   "All Entities Resolved"
                            }
                        </span>
                    </div>
                    <div className="mt-element-step" style={styles.stepElement}>
                        <div className="row step-default ">
                            {   props.entityObject != null 
                            ?   <div className="col-md-12 bg-grey mt-step-col error">
                                    <div className="mt-step-number-custom first bg-white font-red-mint">{props.annotatedEntities}</div>
                                    <div className="mt-step-content font-grey-cascade" style={styles.entityFont}>{props.entityObject.description}</div>
                                </div>
                            :   <div className="col-md-12 bg-grey mt-step-col error">
                                    <div className="mt-step-number first bg-white font-red-mint">{props.annotatedEntities - 1}</div>
                                </div>
                            }
                            
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
        fontSize: '30px'
    },
    descriptionFont: {
        fontSize: '20px'
    },
    stepElement: {
        padding: '5%'
    }
}

MainEntityData.propTypes = {
    entityObject: PropTypes.obj,
    annotatedEntities: PropTypes.number.isRequired
}

module.exports = MainEntityData;
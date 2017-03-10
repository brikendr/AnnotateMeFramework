var React = require('react');
var PropTypes = React.PropTypes;

function AnnotateMeFooter(props) {
    var displayFooter = props.shouldFooterShowup ? "showDisclaimer":"hideDisclaimer"
    return (
        <footer style={footerStyles.container} className="col-md-12">
            <button className="btn red-mint" style={footerStyles.disclaimerButton} onClick={props.onToggleFooter} >Finish Experiment</button>
            <div className={"row "+displayFooter}>
                <div className="col-md-12" style={{padding: '0px'}}>
                    <div className="portlet light bg-red-mint bg-font-red-mint" style={{marginBottom: '0px'}}>
                        <div className="portlet-body">
                            <div className="row">
                                {props.children}
                            </div>                                              
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

AnnotateMeFooter.propTypes = {
    onToggleFooter: PropTypes.func.isRequired,
    shouldFooterShowup: PropTypes.bool.isRequired
}

var footerStyles = {
    container: {
        position: 'absolute',
        bottom: 0,
        margin: '0 auto'
    },
    disclaimerButton: {
        display: 'block',
        margin: '0 auto'
    }
}

module.exports =  AnnotateMeFooter;
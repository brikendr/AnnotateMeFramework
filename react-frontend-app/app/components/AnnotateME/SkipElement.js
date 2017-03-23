var React = require('react');
var PropTypes = React.PropTypes;

function SkipElement (props) {
    return (
        <div className="portlet light red-mint margin-top-10" style={{padding: '1px 0px 0px 3px !important'}}>
                <div className="portlet-title">
                    <div className="caption">
                        <label className="mt-checkbox mt-checkbox-outline">
                            <input type="checkbox" checked={false} name="test" onClick={props.onSkipAnnotation}/>
                            <span></span>
                        </label>
                        <span className="caption-subject bold font-white"  style={{cursor: 'pointer'}} > SKIP This Annotation</span>
                    </div>
                </div>
            </div>
    );
}
var styles = {
    thinPortlet: {
        padding: '1px 0px 0px 3px !important'
    }
}
SkipElement.propTypes = {
    onSkipAnnotation: PropTypes.func.isRequired
}
module.exports = SkipElement;
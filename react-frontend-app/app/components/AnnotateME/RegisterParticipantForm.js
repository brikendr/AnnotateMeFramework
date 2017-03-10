var React = require('react');
var PropTypes = React.PropTypes;
var Loading = require('../Loading');
require('../../styles/login.css');

function RegisterParticipantForm(props) {
    var btnClassname = "btn btn-success uppercase "+ props.participantData.disabled;
    
    return (
        <div className="row" >
            <div className="col-sm-6 col-sm-offset-3">
                <form className="login-form" onSubmit={props.onSubmitForm}>
                    <h3 className="form-title font-green">Register</h3>
                    {props.participantData.errorMessage !== '' && <div className="alert alert-danger display-hide" style={{display: 'block'}}><span>{props.participantData.errorMessage}</span></div>}
                    <div className="form-group">
                        <label className="control-label visible-ie8 visible-ie9">Participant NR</label>
                        <input  className="form-control form-control-solid placeholder-no-fix" 
                                type="text" onChange={props.onParticipantNameUpdate} 
                                placeholder="Enter Your Participant Number"
                                value={props.participantData.participantNr}  /> 
                    </div>
                    <div className="form-actions">
                        {props.participantData.countMessage !== '' && <div className="alert alert-info display-hide" style={{display: 'block'}}><strong>{props.participantData.countMessage + ' ' + props.participantData.countDown}</strong></div>}
                        <button type="submit" className={btnClassname}>Submit & Start</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

RegisterParticipantForm.propTypes = {
    participantData: PropTypes.object.isRequired,
    onParticipantNameUpdate: PropTypes.func.isRequired,
    onSubmitForm: PropTypes.func.isRequired
}

module.exports = RegisterParticipantForm;
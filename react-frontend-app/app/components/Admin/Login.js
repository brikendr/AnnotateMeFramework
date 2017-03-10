var React = require('react');
var PropTypes = React.PropTypes;
var MainContainer = require('../MainContainer');
var styles = require('../../styles')
require('../../styles/login.css');

function Login(props) {
    return (
        <MainContainer>
            <div className="row" >
                <div className="col-sm-6 col-sm-offset-3">
                    <form className="login-form" onSubmit={props.onLogin}>
                        <h3 className="form-title font-green">Sign In</h3>
                        {props.loginData.errorMessage !== '' && <div className="alert alert-danger display-hide" style={{display: 'block'}}><span>{props.loginData.errorMessage}</span></div>}
                        <div className="form-group">
                            <label className="control-label visible-ie8 visible-ie9">Username</label>
                            <input className="form-control form-control-solid placeholder-no-fix" type="text" onChange={props.onUpdateUsername} placeholder="Username"  /> </div>
                        <div className="form-group">
                            <label className="control-label visible-ie8 visible-ie9">Password</label>
                            <input className="form-control form-control-solid placeholder-no-fix" type="password" onChange={props.onUpdatePassword} placeholder="Password" name="password" /> </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-success uppercase">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </MainContainer>
    );
}

Login.propTypes = {
    loginData: PropTypes.object.isRequired,
    onLogin: PropTypes.func.isRequired,
    onUpdateUsername: PropTypes.func.isRequired,
    onUpdatePassword: PropTypes.func.isRequired
}

module.exports = Login;
var React = require('react');
var AdminData = require('../utils/adminData.json');
var Login = require('../components/Login');

var puke = function(object) {
    return <pre>{JSON.stringify(object, null, '')}</pre>;
}
var LoginContainer = React.createClass({
    getInitialState: function() {
        return {
            username: '',
            password: '',
            isUsernameValid: false,
            isPasswordValid: false,
            errorMessage: ''
        }
    },
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    handleLogin: function(e) {
        e.preventDefault();
        if(this.state.isUsernameValid === true && this.state.isPasswordValid === true) {
            if(this.state.username === AdminData.username && this.state.password === AdminData.password) {
                 AdminData.isAuthenticated = true;
                 this.context.router.push('/adminDashboard');
            } else {
                this.setState({
                   errorMessage: 'Wrong Credentials!' 
                });
            }
        }
    },
    handleUpdateUsername: function(e) {
        let username = e.target.value;
        if(username !== '') {
            this.setState({
                username: username,
                isUsernameValid: true
            });
        } else {
            this.setState({
                errorMessage: "Username Cannot be empty!"
            });
        }
    },
    handleUpdatePassword: function(e) {
        let password = e.target.value;
        if(password !== '') {
            this.setState({
                password: password,
                isPasswordValid: true
            });
        }else {
            this.setState({
                errorMessage: "Password Cannot be empty!"
            });
        }
    },
    render: function() {
        return (
                <Login 
                    onLogin={this.handleLogin}
                    onUpdateUsername={this.handleUpdateUsername}
                    onUpdatePassword={this.handleUpdatePassword}
                    loginData={this.state}/>
            )
    }
});

module.exports = LoginContainer;
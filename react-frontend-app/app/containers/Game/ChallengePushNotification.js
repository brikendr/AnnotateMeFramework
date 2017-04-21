var React = require('react'),
    PropTypes = React.PropTypes,
    toastr = require('../../assets/js/plugins/bootstrap-toastr/toastr.min.js');

var ChallengePushNotification = React.createClass({
    getInitialState: function() {
        return {
            didPushNotificationShow: false 
        }
    },
    componentWillMount() {
        require('../../styles/toastr.min.css');
        if(!this.state.didPushNotificationShow)
            this.initToastr();
    },
    initToastr() {
        this.setState({didPushNotificationShow: true});
        toastr.options = {
                "closeButton": false,
                "debug": false,
                "positionClass": "toast-bottom-right",
                "showDuration": "1000",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }
            toastr[this.props.notificationStatus](this.props.message, "Challenge Update!");
    },
    render(){
        return (
             <div></div>
        );
    }
});

ChallengePushNotification.propTypes = {
  message: PropTypes.string.isRequired,
  notificationStatus: PropTypes.string.isRequired
};

module.exports = ChallengePushNotification;
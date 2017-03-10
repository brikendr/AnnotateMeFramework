var React = require('react');
var RegisterParticipantForm = require('../../components/AnnotateME/RegisterParticipantForm');
var Navbar = require('../../components/Navbar');
var MainContainer = require('../../components/MainContainer');
var DataStoreHelper = require('../../utils/dataStoreHelper');

var RegisterParticipantContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            participantNr: new Date().getTime(),
            validParticipantNr: true,
            errorMessage: '',
            countDown: 4,
            countMessage: '',
            disabled: ''
        }
    },
    handleParticipantNameUpdate: function(e) {
        let participantNR = e.target.value;
        if(participantNR !== '') {
            this.setState({
                participantNr: participantNR
            });
        } else {
            this.setState({
                errorMessage: "Participant Nr filed cannot be empty!"
            });
        }
    },
    handleSubmitForm: function(e) {
        e.preventDefault();

        DataStoreHelper.registerParticipant(this.state.participantNr)
        .then(function(participant) {
            this.interval = setInterval(function() {
                if(this.state.countDown == 0){
                    this.stopCounter();
                    this.context.router.push('/annotationTask/' + participant.id + '/view');
                } else {
                    var currentCount = this.state.countDown;
                    this.setState({
                        countDown: currentCount - 1,
                        countMessage: 'Task will start in: ',
                        disabled: 'disabled'
                    });
                }
            }.bind(this), 1500);
        }.bind(this));
    },
    stopCounter: function() {
        clearInterval(this.interval);
    },
    render: function() {
        return (
                <div>
                    <Navbar />
                    <MainContainer>
                        <RegisterParticipantForm 
                            participantData={this.state}
                            onParticipantNameUpdate={this.handleParticipantNameUpdate}
                            onSubmitForm={this.handleSubmitForm} />
                    </MainContainer>
                </div>
            );
    }
});

module.exports = RegisterParticipantContainer;
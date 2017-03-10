var React = require('react');
var Navbar = require('../../components/Navbar');
var AdminMainComponent = require('../../components/Admin/AdminMainComponent');
var DatastoreHelper = require('../../utils/dataStoreHelper');
var ParticipantList = require('../../components/Admin/ParticipantList');

var ParticipantListContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function(){
        return {
            fetching: true,
            participants: []
        }
    },
    componentDidMount: function() {
        DatastoreHelper.getAllParticipants()
        .then(function(participants) {
            console.log("Participants are ",participants);
            this.setState({
               fetching: false,
               participants: participants
            });
        }.bind(this));
    },
    render: function() {
        return (
            <div>
                <Navbar authenticated={true}/>
                <AdminMainComponent page="Participant List">
                    <ParticipantList 
                        isFetching={this.state.fetching}
                        participants={this.state.participants}/>
                </AdminMainComponent>
            </div>
        );
    }
});

module.exports = ParticipantListContainer;
var React = require('react');
var PropTypes = React.PropTypes;
var Loading = require('./Loading');
var Datatable = require('./Datatable');
var NoteMessage = require('./NoteMessage');


function ParticipantList(props) {
    //Map participants 
    const mappedParticipants = props.participants.map(participant => 
        <tr className="odd gradeX" key={participant.id}>
            <td> {participant.id} </td>
            <td> {participant.name} </td>
            <td> {participant.start_timespan} </td>
            <td> {participant.end_timespan} </td>
        </tr>
    );
    return props.isFetching == true 
        ?   <Loading />
        :   <div>
                {mappedParticipants.length > 0 ? 
                <Datatable tableName="Sentance List">
                    <thead>
                        <tr>
                            <th> ParticipantID </th>
                            <th> Name </th>
                            <th> Start Time </th>
                            <th> End Time </th>
                        </tr>
                    </thead>
                    <tbody>
                        {mappedParticipants}
                    </tbody>
                </Datatable> : <NoteMessage text="No Participants Registered" />}
            </div>
}


ParticipantList.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    participants: PropTypes.array.isRequired
}

module.exports = ParticipantList;
var React = require('react');
var PropTypes = React.PropTypes;
var Loading = require('./Loading');
var Datatable = require('./Datatable');
var ReactToolTip = require('react-tooltip');
var NoteMessage = require('./NoteMessage');


function SentanceList(props) {
    //Map documents 
    const mappedSentances = props.sentances.map(sentance => 
        <tr className="odd gradeX" key={sentance.id}>
            <td> {sentance.id} </td>
            <td> <p data-tip={sentance.description}>{sentance.description.substring(0, 50)+ '...'}</p> <ReactToolTip /></td>
            <td> {sentance.start_index} </td>
            <td> {sentance.end_index} </td>
        </tr>
    );
    return props.isFetching == true 
        ?   <Loading />
        :   <div>
                {mappedSentances.length > 0 ? 
                <Datatable tableName="Sentance List">
                    <thead>
                        <tr>
                            <th> SentanceID </th>
                            <th> Sentance </th>
                            <th> Start Index </th>
                            <th> End Index </th>
                        </tr>
                    </thead>
                    <tbody>
                        {mappedSentances}
                    </tbody>
                </Datatable> : <NoteMessage text="No Sentances Retrieved" />}
            </div>
            
}


SentanceList.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    sentances: PropTypes.array.isRequired
}

module.exports = SentanceList;
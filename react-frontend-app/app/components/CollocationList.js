var React = require('react');
var PropTypes = React.PropTypes;
var Loading = require('./Loading');
var NoteMessage = require('./NoteMessage');
var Datatable = require('./Datatable');


function CollocationList(props) {
    //Map collocations 
    const mappedCollocations = props.collocations.map(collocation => 
        <tr className="odd gradeX" key={collocation.id}>
            <td> {collocation.id} </td>
            <td> {collocation.collocation_json} </td>
            <td> {collocation.pos_json} </td>
        </tr>
    );
    return props.isFetching == true 
        ?   <Loading />
        :   <div>
                {mappedCollocations.length > 0 ? 
                <Datatable tableName="Collocation List">
                    <thead>
                        <tr>
                            <th> CollocationID </th>
                            <th> Context Clue (Collocation) </th>
                            <th> Part of Speech </th>
                        </tr>
                    </thead>
                    <tbody>
                        {mappedCollocations}
                    </tbody>
                    
                </Datatable> : <NoteMessage text="No Collocations Retrieved" />}
            </div>
}


CollocationList.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    collocations: PropTypes.array.isRequired
}

module.exports = CollocationList;
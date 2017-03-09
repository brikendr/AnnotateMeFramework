var React = require('react');
var PropTypes = React.PropTypes;
var Loading = require('./Loading');
var Datatable = require('./Datatable');
var NoteMessage = require('./NoteMessage');

function EntityList(props) {
    //Map Entities 
    const mappedEntities = props.entities.map(entity => 
        <tr className="odd gradeX" key={entity.id}>
            <td> {entity.id} </td>
            <td> {entity.description} </td>
            <td> {entity.start_index} </td>
            <td> {entity.end_index} </td>
            <td> {entity.is_resolved ? "Resolved":"Not Resolved"} </td>
            <td className="center">
                <div className="btn-group">
                    <button className="btn btn-xs green " type="button" onClick={()=>{props.onViewCandidates(entity.id)}} > Candidates </button>
                </div>
                <div className="btn-group">
                    <button className="btn btn-xs red " type="button" onClick={()=>{props.onViewCollocations(entity.id)}} > Collocations </button>
                </div>
                <div className="btn-group">
                    <button className="btn btn-xs purple " type="button" onClick={()=>{props.onViewAnnotations(entity.id)}} > Annotations </button>
                </div>
            </td>
        </tr>
    );
    return props.isFetching == true 
        ?   <Loading />
        :   <div>
                {mappedEntities.length > 0 ? 
                <Datatable tableName="Entity Mentions List">
                    <thead>
                        <tr>
                            <th> EntityID </th>
                            <th> Description </th>
                            <th> Start IDX </th>
                            <th> End IDX </th>
                            <th> Is Resolved </th>
                            <th> Actions </th>
                        </tr>
                    </thead>
                    <tbody>
                        {mappedEntities}
                    </tbody>
                </Datatable> : <NoteMessage text="No Entities Retrieved" />}
            </div>
            
}


EntityList.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    entities: PropTypes.array.isRequired,
    onViewCandidates: PropTypes.func.isRequired,
    onViewCollocations: PropTypes.func.isRequired,
    onViewAnnotations: PropTypes.func.isRequired
}

module.exports = EntityList;
var React = require('react');
var PropTypes = React.PropTypes;
var Loading = require('../Loading');
var NoteMessage = require('./NoteMessage');
var Datatable = require('./Datatable');
var ReactToolTip = require('react-tooltip');
var Utf8 = require('utf8');

function CandidateList(props) {
    //Map candidates 
    const mappedCandidates = props.candidates.map(candidate => 
        <tr className="odd gradeX" key={candidate.id}>
            <td> {candidate.id} </td>
            <td> {candidate.candidate_name} </td>
            <td> {Utf8.decode(candidate.description)}</td>
            <td> {candidate.schema_type} </td>
            <td> <a target="_blank" href={candidate.dbpediaURL}> Link </a> </td>
            <td> {candidate.score} </td>
            <td> {candidate.rank} </td>
            <td> {candidate.total_rank} </td>
            <td> {candidate.is_correct ? "YES":"NO"} </td>
        </tr>
    );
    return props.isFetching == true 
        ?   <Loading />
        :   <div>
                {mappedCandidates.length > 0 ? 
                <Datatable tableName="Candidate List">
                    <thead>
                        <tr>
                            <th> CollocationID </th>
                            <th> Candidate Name </th>
                            <th> Description </th>
                            <th className="col-md-1"> Schema Type </th>
                            <th> DBPedia URL </th>
                            <th className="col-md-1"> Score </th>
                            <th> Rank </th>
                            <th> Total Rank </th>
                            <th> IsCorrect </th>
                        </tr>
                    </thead>
                    <tbody>
                        {mappedCandidates}
                    </tbody>
                    
                </Datatable> : <NoteMessage text="No Candiate Entities Retrieved" />}
            </div>
}


CandidateList.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    candidates: PropTypes.array.isRequired
}

module.exports = CandidateList;
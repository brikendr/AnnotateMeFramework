var React = require('react');
var PropTypes = React.PropTypes;
var Loading = require('../Loading');
var NoteMessage = require('./NoteMessage');
var Datatable = require('./Datatable');
var Link = React.Link;

function AnnotationList(props) {
    //Map candidates 
    const mappedAnnotations = props.annotations.map(annotation => 
        <tr className="odd gradeX" key={annotation.id}>
            <td> {annotation.id} </td>
            <td> {annotation.is_nil ? "YES":"NO"} </td>
            <td> {annotation.timespan}</td>
            <td> {annotation.EntityMention.description} </td>
            <td> {annotation.Participant.name} </td>
            <td> {annotation.Candidate.candidate_name + " [" + annotation.Candidate.rank + " / " + annotation.Candidate.total_rank + "]"} </td>
        </tr>
    );
    return props.isFetching == true 
        ?   <Loading />
        :   <div>
                {mappedAnnotations.length > 0 ? 
                <Datatable tableName="Candidate List">
                    <thead>
                        <tr>
                            <th> AnnotationID </th>
                            <th> Is NIL </th>
                            <th> Annotation Time </th>
                            <th> EntityMention </th>
                            <th> Participant </th>
                            <th> Candidate rank/totalRank </th>
                        </tr>
                    </thead>
                    <tbody>
                        {mappedAnnotations}
                    </tbody>
                    
                </Datatable> : <NoteMessage text="No Annotations Available" />}
            </div>
}


AnnotationList.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    annotations: PropTypes.array.isRequired
}

module.exports = AnnotationList;
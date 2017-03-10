var React = require('react');
var PropTypes = React.PropTypes;
var Loading = require('../Loading');
var Datatable = require('./Datatable');
var NoteMessage = require('./NoteMessage');

function DocumentList(props) {
    //Map documents 
    const mappedDocuments = props.documentList.map(document => 
        <tr className="odd gradeX" key={document.id}>
            <td> {document.id} </td>
            <td> {document.dataset} </td>
            <td> {document.total_entries} </td>
            <td> {document.is_resolved ? "Resolved":"Not Resolved"} </td>
            <td className="center">
                <div className="btn-group">
                    <button className="btn btn-xs green " type="button" onClick={()=>{props.onViewDocument(document.id)}} > View </button>
                </div>
            </td>
        </tr>
    );
    return props.isFetching == true 
        ?   <Loading />
        :   <div>
                {mappedDocuments.length > 0 ? 
                <Datatable tableName="Document List">
                    <thead>
                        <tr>
                            <th> DocID </th>
                            <th> Dataset </th>
                            <th> Total Entries </th>
                            <th> Is Resolved </th>
                            <th> Actions </th>
                        </tr>
                    </thead>
                    <tbody>
                        {mappedDocuments}
                    </tbody>
                </Datatable> : <NoteMessage text="No Document Retrieved" />}
            </div>
}


DocumentList.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    documentList: PropTypes.array.isRequired,
    onViewDocument: PropTypes.func.isRequired
}

module.exports = DocumentList;
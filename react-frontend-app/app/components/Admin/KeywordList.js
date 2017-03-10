var React = require('react');
var PropTypes = React.PropTypes;
var Loading = require('../Loading');
var Datatable = require('./Datatable');
var NoteMessage = require('./NoteMessage');


function SentanceList(props) {
    //Map documents 
    const mappedKeywords = props.keywords.map(keyword => 
        <tr className="odd gradeX" key={keyword.id}>
            <td> {keyword.id} </td>
            <td> {keyword.keyword} </td>
        </tr>
    );
    return props.isFetching == true 
        ?   <Loading />
        :   <div>
                {mappedKeywords.length > 0 ? 
                <Datatable tableName="Sentance List">
                    <thead>
                        <tr>
                            <th> KeywordID </th>
                            <th> Description </th>
                        </tr>
                    </thead>
                    <tbody>
                        {mappedKeywords}
                    </tbody>
                </Datatable> : <NoteMessage text="No Keywords Retrieved" />}
            </div>
}


SentanceList.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    keywords: PropTypes.array.isRequired
}

module.exports = SentanceList;
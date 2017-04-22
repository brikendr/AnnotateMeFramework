var React = require('react');
var PropTypes = React.PropTypes;
var transparentBg = require('../../styles').transparentBg;
var FileReaderInput = require('react-file-reader-input');

function NewDocumentForm(props) {
    return (
            <div className="row" >
                <div className="col-sm-6 col-sm-offset-3">
                    <form className="form" onSubmit={props.onSubmitForm}>
                        <h3 className="form-title font-green">New Document</h3>
                        <div className="form-body">
                            <div className="form-group">
                                <label className="control-label visible-ie8 visible-ie9">Path</label>
                                <input className="form-control form-control-solid placeholder-no-fix" type="text" placeholder="Path" onChange={props.onPathChange}/> </div>
                            <div className="form-group">
                                <label className="control-label visible-ie8 visible-ie9">Dataset</label>
                                <input className="form-control form-control-solid placeholder-no-fix" type="text" placeholder="Dataset" onChange={props.onDatasetChange}/> </div>
                            <div className="form-group">
                                <label className="control-label visible-ie8 visible-ie9">Confidance</label>
                                <input className="form-control form-control-solid placeholder-no-fix" type="text" placeholder="Confidance" onChange={props.onConfidenceChange} /> </div>
                            <div className="form-group">
                                <label className="control-label visible-ie8 visible-ie9">Category</label>
                                <input className="form-control form-control-solid placeholder-no-fix" type="text" placeholder="Category" onChange={props.onCategoryChange} /> </div>
                            <div className="form-group">
                                <label className="control-label visible-ie8 visible-ie9">Support</label>
                                <input className="form-control form-control-solid placeholder-no-fix" type="text" placeholder="Support" onChange={props.onSupportChange} /> </div>
                            <div className="form-group">
                                <label className="control-label visible-ie8 visible-ie9">Nr Keywords to extract</label>
                                <input className="form-control form-control-solid placeholder-no-fix" type="text" placeholder="Nr Keywords to extract" value={4} onChange={props.onKeywordNrChange} /> </div>
                            <div className="form-group">
                                <label className="control-label visible-ie8 visible-ie9">Nr Concepts to extract</label>
                                <input className="form-control form-control-solid placeholder-no-fix" type="text" placeholder="Nr Concepts to extract" value={2} onChange={props.onConceptNrChange} /> </div>
                            <div className="form-group">
                                
                                <div className="mt-checkbox-list">
                                    <label className="mt-checkbox mt-checkbox-outline"> Context Sentance Restrictered
                                        <input type="checkbox" onChange={props.toggleCheckboxValue} name="test" />
                                        <span></span>
                                    </label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="my-file-input">Upload a File:</label>
                                <FileReaderInput as="binary" id="my-file-input"
                                        onChange={props.onInputChange}>
                                    <button type="button" >Select a file!</button>
                                </FileReaderInput>
                                
                            </div>
                            <div className="form-actions" style={transparentBg}>
                                <button type="submit" className="btn col-sm-3 btn-success uppercase">Send</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
    );
}

NewDocumentForm.propTypes = {
    onSubmitForm: PropTypes.func.isRequired,
    onPathChange: PropTypes.func.isRequired,
    onDatasetChange: PropTypes.func.isRequired,
    onConfidenceChange: PropTypes.func.isRequired,
    onSupportChange: PropTypes.func.isRequired,
    onKeywordNrChange: PropTypes.func.isRequired,
    onConceptNrChange: PropTypes.func.isRequired,
    toggleCheckboxValue: PropTypes.func.isRequired,
    onCategoryChange: PropTypes.func.isRequired,
    onInputChange: PropTypes.func.isRequired
}

module.exports = NewDocumentForm;
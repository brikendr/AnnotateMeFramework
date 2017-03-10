var React = require('react');
var Navbar = require('../../components/Navbar');
var MainContainer = require('../../components/MainContainer');
var DataStoreHelper = require('../../utils/dataStoreHelper');
var styles = require('../../styles').transparentBg;
var ContextData = require('../../components/AnnotateME/ContextData');
var Loading = require('../../components/Loading');
var MainEntityData = require('../../components/AnnotateME/MainEntityData');
var CandidateData = require('../../components/AnnotateME/CandidateData');
var AnnotateMeFooter = require('../../components/AnnotateME/AnnotateMeFooter');

var AnnotateMeMainContainer = React.createClass({
    getInitialState: function() {
        return {
            isFetching: false,
            collocations: [],
            neighborEntities: [],
            keywords: [],
            candidates: [],
            main_entity: null,
            nr_annotations: 0,
            footerPreview: false,
        }
    },
    handleCandidateSelection: function(e){
        console.log('Handeling candidate selection!');
    },
    handleOnToggleFooter: function(){
        console.log('Setting disclaimer');
        this.setState({
            footerPreview: !this.state.footerPreview
        });
    },
    render: function(){
        return (
            <div>
                <Navbar />
                <div className="container-fluid">
                    <div className="page-content page-content-popup">
                        <div className="page-fixed-main-content" >
                            <div className="row">
                                { this.state.isFetching
                                ?   <Loading />
                                : 
                                <div>
                                    <ContextData
                                        collocations={this.state.collocations}
                                        neighborEntities={this.state.neighborEntities}
                                        keywords={this.state.keywords} />

                                    <MainEntityData entityName={"Barack Obama"} annotatedEntities={this.state.nr_annotations + 1} />
                                    
                                    <CandidateData 
                                        candidates={this.state.candidates}
                                        onSelectCandidate={this.handleCandidateSelection}/>
                                </div>
                                }
                                
                            </div>
                        </div>
                    </div>
                </div>
                <AnnotateMeFooter onToggleFooter={this.handleOnToggleFooter} shouldFooterShowup={this.state.footerPreview}>
                    <div className="col-md-3">
                        <p  className="text-left" 
                            style={{fontSize: '20px'}} >
                                {this.state.nr_annotations} Annotations Resolved
                        </p>
                    </div>
                    <div className="col-md-3 pull-right">
                        <button type="button" className="btn btn-lg white uppercase pull-right font-red-mint">Finish</button>
                    </div>
                </AnnotateMeFooter>
            </div>
        )
    }
});



module.exports = AnnotateMeMainContainer;
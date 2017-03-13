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
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            isFetching: true,
            participantID: null,
            collocations: [],
            neighborEntities: [],
            keywords: [],
            candidates: [],
            selected_entity: null,
            nr_annotations: 0,
            footerPreview: false,
            annotatedEntities: []
        }
    },
    componentDidMount: function() {
        //TODO: Update participant start timestamp!
        var player = this.props.routeParams.participantNR;
        this.setState({
            participantID: player
        });
        
        DataStoreHelper.updateParticipantStartTime(player);
        this.fetchDataFromService();
    },
    fetchDataFromService: function(){
        //Fetch all the necessary data from the DataPrep-Service 
        DataStoreHelper.fetchDataForAnnotateMe(this.state.annotatedEntities)
        .then(function(response){
            if(response == null) {
                this.setState({
                    isFetching: false,
                    collocations: [],
                    neighborEntities: [],
                    keywords: [],
                    candidates: [],
                    selected_entity: null,
                });
                return;
            }
            this.setState({
                selected_entity: response.entity,
                collocations: response.collocations,
                neighborEntities: response.neighborEntities,
                keywords: response.docKeywords,
                candidates: response.candidates,
                isFetching: false
            });
        }.bind(this));
    },
    handleCandidateSelection: function(candidateID, e){
        console.log('NR OF ANNOTATIONS ',this.state.nr_annotations, Date.now());
        DataStoreHelper.annotateEntity(candidateID, this.state.selected_entity.id, this.state.participantID)
        .then(function(response){
            this.setState({
                annotatedEntities: [...this.state.annotatedEntities, this.state.selected_entity.id],
                nr_annotations: this.state.nr_annotations + 1,
                isFetching: true
            });
            this.fetchDataFromService();
        }.bind(this));
    },
    handleOnToggleFooter: function(){
        this.setState({
            footerPreview: !this.state.footerPreview
        });
    },
    handleOnFinishExperiment: function() {
        //Update Participant End time 
    DataStoreHelper.updateParticipantEndTime(this.state.participantID)
    .then(function(response){
        //Send to final view 
        this.context.router.push('/annotationTask/finalizeExperiment');
    }.bind(this));
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

                                    <MainEntityData entityObject={this.state.selected_entity} annotatedEntities={this.state.nr_annotations + 1} />
                                    
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
                        <button type="button" onClick={this.handleOnFinishExperiment} className="btn btn-lg white uppercase pull-right font-red-mint margin-right-10">Finish</button>
                    </div>
                </AnnotateMeFooter>
            </div>
        )
    }
});



module.exports = AnnotateMeMainContainer;
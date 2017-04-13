var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var hashHistory = ReactRouter.hashHistory;
var IndexRoute = ReactRouter.IndexRoute;
var Main = require('../components/Main');
var Home = require("../components/Home");

/*--------------------- START DEFINING ADMIN ROUTES --------------------------------*/
var LoginContainer = require('../containers/Admin/LoginContainer');
var Dashboard = require('../components/Admin/Dashboard');
var DocumentListContainer = require('../containers/Admin/DocumentListContainer');
var DocumentExploreContainer = require('../containers/Admin/DocumentExploreContainer');
var SentanceListContainer = require('../containers/Admin/SentanceListContainer');
var KeywordListContainer = require('../containers/Admin/KeywordListContainer');
var EntityListContainer = require('../containers/Admin/EntityListContainer');
var CollocationListContainer = require('../containers/Admin/CollocationListContainer');
var CandidateListContainer = require('../containers/Admin/CandidateListContainer');
var AnnotationsListContainer = require('../containers/Admin/AnnotationListContainer');
var ParticipantListContainer = require('../containers/Admin/ParticipantListContainer');
var NewDocumentContainer = require('../containers/Admin/NewDocumentContainer');
/*------------------------ END OF ADMIN ROUTES --------------------------------------*/

/*-------------------------- START ANNOTATEME ROUTES ---------------------------------*/
var RegisterParticipantContainer = require('../containers/AnnotateMe/RegisterParticipantContainer');
var AnnotateMeMainContainer = require('../containers/AnnotateMe/AnnotateMeMainContainer');
var FinalExperimentContainer = require('../containers/AnnotateMe/FinalExperimentContainer');
/*--------------------------- END OF ANNOTATEME ROUTES ------------------------------*/

/*------------------------------------ GAME ROUTES--------------------------------------------*/
var GameIntroScreen = require('../containers/Game/GameIntroContainer');
var OnBoardingContainer = require('../containers/Game/Onboarding/OnboardingContainer');
/*---------------------------------END GAME ROUTES--------------------------------------------*/

var routes = (
  <Router history={hashHistory}>
    <Route path='/' component={Main}>
      <IndexRoute component={GameIntroScreen} />
      <Route path='/adminPanel' component={LoginContainer} />
      <Route path='/adminDashboard' component={Dashboard} />
      <Route path='/documents' component={DocumentListContainer} />
      <Route path='/documents/:documentID' component={DocumentExploreContainer} />
      <Route path='/documents/:documentID/sentances' component={SentanceListContainer} />
      <Route path='/documents/:documentID/keywords' component={KeywordListContainer} />
      <Route path='/documents/:documentID/entityMentions' component={EntityListContainer} />
      <Route path='/documents/:documentID/entityMentions/:entityID/collocations' component={CollocationListContainer} />
      <Route path='/documents/:documentID/entityMentions/:entityID/candidates' component={CandidateListContainer} />
      <Route path='/documents/:documentID/entityMentions/:entityID/annotations' component={AnnotationsListContainer} />
      <Route path='/participants' component={ParticipantListContainer} />
      <Route path='/newDocument' component={NewDocumentContainer} />

      <Route path='/registerParticipant' component={RegisterParticipantContainer} />
      <Route path='/annotationTask/:participantNR/view' component={AnnotateMeMainContainer} />
      <Route path='/annotationTask/finalizeExperiment' component={FinalExperimentContainer} />
      
      <Route path='/aboardIntro' component={OnBoardingContainer} />
      
    </Route>
  </Router>
);

module.exports = routes;
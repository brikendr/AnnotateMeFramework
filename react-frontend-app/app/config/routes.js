var React = require('react'),
  ReactRouter = require('react-router'),
  Router = ReactRouter.Router,
  Route = ReactRouter.Route,
  hashHistory = ReactRouter.hashHistory,
  IndexRoute = ReactRouter.IndexRoute,
  Main = require('../components/Main'),
  Home = require("../components/Home");

/*--------------------- START DEFINING ADMIN ROUTES --------------------------------*/
var LoginContainer = require('../containers/Admin/LoginContainer'),
  Dashboard = require('../components/Admin/Dashboard'),
  DocumentListContainer = require('../containers/Admin/DocumentListContainer'),
  DocumentExploreContainer = require('../containers/Admin/DocumentExploreContainer'),
  SentanceListContainer = require('../containers/Admin/SentanceListContainer'),
  KeywordListContainer = require('../containers/Admin/KeywordListContainer'),
  EntityListContainer = require('../containers/Admin/EntityListContainer'),
  CollocationListContainer = require('../containers/Admin/CollocationListContainer'),
  CandidateListContainer = require('../containers/Admin/CandidateListContainer'),
  AnnotationsListContainer = require('../containers/Admin/AnnotationListContainer'),
  ParticipantListContainer = require('../containers/Admin/ParticipantListContainer'),
  NewDocumentContainer = require('../containers/Admin/NewDocumentContainer');
/*------------------------ END OF ADMIN ROUTES --------------------------------------*/

/*-------------------------- START ANNOTATEME ROUTES ---------------------------------*/
var RegisterParticipantContainer = require('../containers/AnnotateMe/RegisterParticipantContainer'),
  AnnotateMeMainContainer = require('../containers/AnnotateMe/AnnotateMeMainContainer'),
  FinalExperimentContainer = require('../containers/AnnotateMe/FinalExperimentContainer');
/*--------------------------- END OF ANNOTATEME ROUTES ------------------------------*/

/*------------------------------------ GAME ROUTES--------------------------------------------*/
var GameIntroScreen = require('../containers/Game/GameIntroContainer'),
  OnBoardingContainer = require('../containers/Game/Onboarding/OnboardingContainer'),
  GameMainScreen = require('../containers/Game/GameHomeContainer'),
  GameplayContainer  = require('../containers/Game/GameplayContainer'),
  PlayerProfile = require('../containers/Game/Player/PlayerProfile'),
  GameLeaderboard = require('../containers/Game/Player/Leaderboard'),
  ChallengeGame = require('../containers/Game/ChallengeGame');
/*---------------------------------END GAME ROUTES--------------------------------------------*/
//TODO CHANGE INDEX ROUTE TO GAME INTRO
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
      <Route path='/fasttype/home' component={GameMainScreen} />
      <Route path='/play' component={GameplayContainer} />
      <Route path='/profile' component={PlayerProfile} />
      <Route path='/leaderboard' component={GameLeaderboard} />
      <Route path='/challenge/:opponentID' component={ChallengeGame} />
    </Route>
  </Router>
);

module.exports = routes;
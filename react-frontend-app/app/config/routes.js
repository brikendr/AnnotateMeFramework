var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var hashHistory = ReactRouter.hashHistory;
var IndexRoute = ReactRouter.IndexRoute;
var Main = require('../components/Main');
var Home = require("../components/Home");


var LoginContainer = require('../containers/LoginContainer');
var Dashboard = require('../components/Dashboard');
var DocumentListContainer = require('../containers/DocumentListContainer');
var DocumentExploreContainer = require('../containers/DocumentExploreContainer');
var SentanceListContainer = require('../containers/SentanceListContainer');
var KeywordListContainer = require('../containers/KeywordListContainer');
var EntityListContainer = require('../containers/EntityListContainer');
var CollocationListContainer = require('../containers/CollocationListContainer');
var CandidateListContainer = require('../containers/CandidateListContainer');
var AnnotationsListContainer = require('../containers/AnnotationListContainer');
var ParticipantListContainer = require('../containers/ParticipantListContainer');
var NewDocumentContainer = require('../containers/NewDocumentContainer');

var routes = (
  <Router history={hashHistory}>
    <Route path='/' component={Main}>
      <IndexRoute component={Home} />
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
    </Route>
  </Router>
);

module.exports = routes;
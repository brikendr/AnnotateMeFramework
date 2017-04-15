var React = require('react'),
    ReactDOM = require('react-dom'),
    routes = require('./config/routes'),
    Router = require('react-router').Router,
    browserHistory = require('react-router').browserHistory,
    Provider = require('react-redux').Provider,
    store = require('./redux/store');



ReactDOM.render(
    <Provider store={store}>
        <Router routes={routes} history={ browserHistory } />
    </Provider>,
    document.getElementById('app')
);
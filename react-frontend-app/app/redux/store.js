var Redux = require("redux"),
	userReducer = require("./reducers/userReducer"),
    gameReducer = require("./reducers/gameReducer"),
	initialState = require("./initialState"),
    promise = require('redux-promise-middleware').default,
    {logger} = require('redux-logger'),
    {loadState, saveState} = require('./localStorage');

var rootReducer = Redux.combineReducers({
	user: userReducer,   // this means userReducer will operate on appState.user
	game: gameReducer // gameReducer will operate on appState.game,
});

const middleware = Redux.applyMiddleware(promise());

const persistedState = loadState();
const store = Redux.createStore(rootReducer, persistedState, middleware);

store.subscribe(() => {
    saveState({
        user: store.getState().user,
        fetchingData: store.getState().fetchingData
    });
});

module.exports = store;//Redux.applyMiddleware(promise(), logger)(Redux.createStore)(rootReducer,initialState());
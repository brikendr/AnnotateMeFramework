var initialState = require("../initialState");

module.exports = function(state,action){
	var newstate = Object.assign({},state); // sloppily copying the old state here, so we never mutate it
	
    switch (action.type) {
        case "USER_AUTHENTICATED": {
            newstate.authenticated = true;
            newstate.information = action.payload;
			return newstate;
        }
        case "LOGOUT_USER": {
            state = initialState;
        }
    }
    return state || initialState().user
    
};
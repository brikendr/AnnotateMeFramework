var initialState = require("../initialState");

module.exports = function(state,action){
	var newstate = Object.assign({},state); // sloppily copying the old state here, so we never mutate it
	
    switch (action.type) {
        case "TOGGLE_FETCHDATA": {
            console.log("AT GAME TOGGLE");
            newstate.fetchingData = !newstate.fetchingData;
            return newstate;
        }
    }
    return state || initialState().game
    
};
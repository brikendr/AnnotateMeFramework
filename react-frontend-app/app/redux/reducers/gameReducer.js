var initialState = require("../initialState");

module.exports = function(state,action){
	var newstate = Object.assign({},state); // sloppily copying the old state here, so we never mutate it
	
    switch (action.type) {
        case "TOGGLE_FETCHDATA": {
            newstate.fetchingData = !newstate.fetchingData;
            return newstate;
        }
        case "SET_PLAYER_STATS": {
            newstate.playerStats = action.payload;
            return newstate;
        }
        case "SET_PLAYER_SCORE": {
            newstate.playerStats.stats.Player.points = state.playerStats.stats.Player.points + action.payload;
            return newstate;
        } 
        case "SET_PLAYER_WPM": {
            newstate.playerStats.stats.current_wps = action.payload;
            return newstate;
        }
        case "SET_PLAYER_LEVEL": {
            newstate.playerStats.level = action.payload;
            return newstate;
        }
    }
    return state || initialState().game
    
};

module.exports = {
	setPlayerScore: function(jsonData){
		return {type: "SET_PLAYER_SCORE", payload: jsonData};
	},
	setPlayerStats: function(jsonData){
		return {type: "SET_PLAYER_STATS", payload: jsonData};
	},
	setPlayerWPM: function(jsonData){
		return {type: "SET_PLAYER_WPM", payload: jsonData};
	},
	setPlayerLevel: function(jsonData){
		return {type: "SET_PLAYER_LEVEL", payload: jsonData};
	}
};

module.exports = {
	userAuthenticated: function(jsonData){
		return {type: "USER_AUTHENTICATED", payload: jsonData};
	},
    logoutUser() {
        return {type: "LOGOUT_USER"};
    },
    toggleDataFetching() {
        return {type: "TOGGLE_FETCHDATA"};
    }
};
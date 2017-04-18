module.exports = function(){
	return {
		// "persistent" data on heroes
		user: {
            authenticated: false
        },
        game: {
			fetchingData: false,
			playerStats: {}
		}
	};
};
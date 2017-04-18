var axios = require('axios');


const MainUrl = 'http://localhost:8123/game/';
var GameHelper = {
    authenticateUser: function(username, password) {
        return axios.post(MainUrl + 'authenticate', 
        {
            'username': username,
            'password': password
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (err) {
            console.warn('Error in GameHelper:authenticateUser: ', err);
        });
    },
    registerPlayer: function(data) {
        return axios.post(MainUrl + 'register', data)
        .then(function (response) {
            return response.data;
        })
        .catch(function (err) {
            console.warn('Error in GameHelper:registerPlayer: ', err);
        });
    },
    getCategories: function() {
        return axios.get(MainUrl + 'categories')
        .then(function (response) {
            console.log(response.data);
            return response.data;
        })
        .catch(function (err) {
            console.warn('Error in GameHelper:getCategories: ', err);
        });
    },
    getCategoriesAndPlayerStats: function(playerId) {
        return this.getCategories()
            .then(function(categories){
                return this.getPlayerStats(playerId).
                    then(function(playerStats){
                        return {
                            'categories': categories.resource,
                            'playerStats': playerStats.resource
                        }
                    });
            }.bind(this));
    },
    getPlayerStats: function(playerID){
        return axios.get(MainUrl + 'playerStats/' + playerID)
        .then(function (response) {
            console.log(response.data);
            return response.data;
        })
        .catch(function (err) {
            console.warn('Error in GameHelper:getPlayerStats: ', err);
        });
    },
    registerPoint: function(point, playerID){
        return axios.post(MainUrl + 'score/' + playerID, {'point': point}).catch(function (err) {
            console.warn('Error in GameHelper:registerPoint: ', err);
        });
    },
    updatePlayerWPM: function(newWPM, playerID) {
        return axios.post(MainUrl + 'wpm/' + playerID, {'wpm': newWPM}).catch(function (err) {
            console.warn('Error in GameHelper:updatePlayerWPM: ', err);
        });
    },
    checkPlayerHasLeveledUp: function(currentLevel, player) {
        return axios.post(MainUrl + 'level/' + player.id + '/levelUpPlayer', {'player': player, 'currentLevel': currentLevel})
        .then(function (response) {
            return response.data;
        })
        .catch(function (err) {
            console.warn('Error in GameHelper:getPlayerStats: ', err);
        });
    },
    persistGameRound: function(gameData) {
        return axios.post(MainUrl + '/addGameRound', {'gameData': gameData})
        .then(function (response) {
            return response.data;
        })
        .catch(function (err) {
            console.warn('Error in GameHelper:getPlayerStats: ', err);
        });
    }
}

module.exports = GameHelper;
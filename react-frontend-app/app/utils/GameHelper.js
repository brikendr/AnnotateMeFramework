var axios = require('axios'),
    passwordHash = require('password-hash')

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
    getCategories: function(playerId) {
        return axios.get(MainUrl + 'categories/'+playerId)
        .then(function (response) {
            return response.data;
        })
        .catch(function (err) {
            console.warn('Error in GameHelper:getCategories: ', err);
        });
    },
    getCategoriesAndPlayerStats: function(playerId) {
        return this.getCategories(playerId)
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
            console.warn('Error in GameHelper:checkPlayerHasLeveledUp: ', err);
        });
    },
    persistGameRound: function(gameData) {
        return axios.post(MainUrl + '/addGameRound', {'gameData': gameData})
        .then(function (response) {
            return response.data;
        })
        .catch(function (err) {
            console.warn('Error in GameHelper:persistGameRound: ', err);
        });
    },
    updateGameRoundFinishTime: function(gameId) {
        return axios.post(MainUrl + '/updateGameFinishTime', {'gameId': gameId, 'finishTime': new Date().getTime()})
        .then(function (response) {
            return response.data;
        })
        .catch(function (err) {
            console.warn('Error in GameHelper:persistGameRound: ', err);
        });
    },
    fetchPossibleChallengers: function(playerId, wpm) {
        return axios.get(MainUrl + 'getPossibleChallengers/wpm/'+wpm+'/player/' + playerId)
        .then(function (response) {
            return response.data;
        })
        .catch(function (err) {
            console.warn('Error in GameHelper:fetchPossibleChallengers: ', err);
        });
    },
    registerChallengers: function(data) {
        return axios.post(MainUrl + 'challengePlayers', {data})
        .then(function (response) {
            return response.data;
        })
        .catch(function (err) {
            console.warn('Error in GameHelper:registerChallengers: ', err);
        });
    },
    fetchPlayerChallenges: function(playerId) {
        return axios.get(MainUrl + 'getPlayerChallenges/' + playerId)
        .then(function (response) {
            return response.data;
        })
        .catch(function (err) {
            console.warn('Error in GameHelper:fetchPlayerChallenges: ', err);
        });
    },
    getChallengeInfo: function(challengeId) {
        return axios.get(MainUrl + 'getChallengeInfo/' + challengeId)
        .then(function (response) {
            return response.data;
        })
        .catch(function (err) {
            console.warn('Error in GameHelper:getChallengeInfo: ', err);
        });
    },
    updateChallenge: function(data){
        return axios.post(MainUrl + 'updateChallenge', {data})
        .then(function (response) {
            return response.data;
        })
        .catch(function (err) {
            console.warn('Error in GameHelper:updateChallenge: ', err);
        });
    },
    getProfileStats: function(playerId) {
        return axios.get(MainUrl + 'getProfileStats/' + playerId)
        .then(function (response) {
            return response.data;
        })
        .catch(function (err) {
            console.warn('Error in GameHelper:getProfileStats: ', err);
        });
    },
    getUpdatedChallenged: function(playerId) {
        return axios.get(MainUrl + 'getUpdatedChallenges/' + playerId)
        .then(function (response) {
            return response.data;
        })
        .catch(function (err) {
            console.warn('Error in GameHelper:getUpdatedChallenged: ', err);
        });
    },
    getLeaderboard() {
        return axios.get(MainUrl + 'getLeaderBoard/')
        .then(function (response) {
            return response.data;
        })
        .catch(function (err) {
            console.warn('Error in GameHelper:getPlayersRanked: ', err);
        });
    },
    shouldBotChallangePlayer(playerId) {
        return axios.get(MainUrl + 'botChallengePlayer/' + playerId)
        .then(function (response) {
            return response.data;
        })
        .catch(function (err) {
            console.warn('Error in GameHelper:getPlayersRanked: ', err);
        });
    }
}

module.exports = GameHelper;
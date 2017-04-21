var axios = require('axios');

var GameDataPrep = {
    fetchGameRoundData: function(playerID, categoryID) {
        return axios.post('http://localhost:8128/game/api/getGameRoundData', {'playerId': playerID, 'categoryId': categoryID})
        .then(function (response) {
            return response.data.resource;
        })
        .catch(function (err) {
            console.warn('Error in GameHelper:persistGameRound: ', err);
        });
    }
}

module.exports = GameDataPrep;
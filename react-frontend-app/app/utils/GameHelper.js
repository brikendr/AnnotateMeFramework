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
            console.warn('Error in GameHelper:authenticateUser: ', err);
        });
    }

}

module.exports = GameHelper;
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
            return response.data;
        })
        .catch(function (err) {
            console.warn('Error in GameHelper:getCategories: ', err);
        });
    }
}

module.exports = GameHelper;
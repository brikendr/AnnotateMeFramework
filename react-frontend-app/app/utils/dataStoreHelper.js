var axios = require('axios');


const MainUrl = 'http://localhost:8123/docs/';
var DataStoreHelper = {
    getAllDocs: function() {
        return axios(MainUrl)
        .then(function(response){
            return response.data;
        })
        .catch(function (err) { console.warn('Error in getAllDocs: ', err)});
    },
    getDocumentSentances: function(documentID) {
        return axios(MainUrl + documentID + '/sentances')
        .then(function(response){
            return response.data.resource;
        })
        .catch(function (err) { console.warn('Error in getDocumentSentances: ', err)});
    },
    getDocumentKeywords: function(documentID) {
        return axios(MainUrl + documentID + '/keywords')
        .then(function(response){
            return response.data.resource;
        })
        .catch(function (err) { console.warn('Error in getDocumentKeywords: ', err)});
    },
    getDocumentEntities: function(documentID) {
        return axios(MainUrl + documentID + '/entities')
        .then(function(response){
            return response.data.resource;
        })
        .catch(function (err) { console.warn('Error in getDocumentEntities: ', err)});
    },
    getEntityCollocations: function(entityID) {
        return axios('http://localhost:8123/entities/' + entityID + '/collocations')
        .then(function(response){
            return response.data.resource;
        })
        .catch(function (err) { console.warn('Error in getEntityCollocations: ', err)});
    },
    getEntityCandidates: function(entityID) {
        return axios('http://localhost:8123/entities/' + entityID + '/candidates')
        .then(function(response){
            return response.data.resource;
        })
        .catch(function (err) { console.warn('Error in getEntityCandidates: ', err)});
    },
    getEntityAnnotations: function(entityID) {
        return axios('http://localhost:8123/entities/' + entityID + '/annotations')
        .then(function(response){
            return response.data.resource;
        })
        .catch(function (err) { console.warn('Error in getEntityCandidates: ', err)});
    },
    getAllParticipants: function() {
        return axios('http://localhost:8123/participants')
        .then(function(response){
            return response.data;
        })
        .catch(function (err) { console.warn('Error in getEntityCandidates: ', err)});
    },
    invokeBrooker: function(data){
        return axios.post('http://localhost:8123/brookerInvoke', data)
        .then(function (response) {
            console.log('Respose is ', response.data.msg);
            return response.data;
        })
        .catch(function (err) {
            console.warn('Error in invokeBrooker: ', err);
        });
    },
    registerParticipant: function(participant) {
        return axios.post('http://localhost:8123/participants', 
        {
            'name': participant
        })
        .then(function (response) {
            return response.data.resource;
        })
        .catch(function (err) {
            console.warn('Error in invokeBrooker: ', err);
        });
    }
}

module.exports = DataStoreHelper;
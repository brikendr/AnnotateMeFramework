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
    },
    fetchDataForAnnotateMe: function(annotatedEntities, nr_annotations){
        //If participant has reached 5 anntations, show the NIL (for quality assurance)
        console.log("NR ENTITIES IS ", nr_annotations);
        if(nr_annotations == 6) {
            return this.fetchNILEntity();
        }
        return axios({
                method: 'post',
                url: 'http://localhost:8128/annotateme/api/getTaskData',
                data: {
                    exludedEntities: annotatedEntities
                }
        })
        .then(function(response){
            return response.data.resource;
        })
        .catch(function (err) { console.warn('Error in fetchDataForAnnotateMe: ', err)});
    },
    fetchNILEntity: function(){
        return axios({
                method: 'post',
                url: 'http://localhost:8128/annotateme/api/getNILEntity'
        })
        .then(function(response){
            return response.data.resource;
        })
        .catch(function (err) { console.warn('Error in fetchDataForAnnotateMe: ', err)});
    },
    annotateEntity: function(candidateID,entityId, participantID) {
        var data = {
            'isNil': candidateID == "NIL" ? true:false,
            'entityId': entityId,
            'participantId': participantID,
            'candidateId': candidateID == "NIL" ? null:candidateID,
        }
        return axios.post('http://localhost:8123/annotations', data)
        .then(function (response) {
            return response.data.resource;
        })
        .catch(function (err) {
            console.warn('Error in invokeBrooker: ', err);
        });
    },
    updateParticipantStartTime: function(participantID) {
        return axios.post('http://localhost:8123/participants/' + participantID + '/updateStartTime')
        .then(function(response){
            return response.datas;
        })
        .catch(function (err) { console.warn('Error in updateParticipantStartTime: ', err)});
    },
    updateParticipantEndTime: function(participantID) {
        return axios.post('http://localhost:8123/participants/' + participantID + '/updateEndTime')
        .then(function(response){
            return response.datas;
        })
        .catch(function (err) { console.warn('Error in updateParticipantStartTime: ', err)});
    }

}

module.exports = DataStoreHelper;
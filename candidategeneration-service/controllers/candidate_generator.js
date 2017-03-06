var querystring = require('querystring');
var rest = require("./rest");
var async = require('async');
var utf8 = require('utf8');

/* Headers that are used for querying DBpedia spotlight */
var getHeaders = function() {
    var headers = {
        'Content-Type':     'application/x-www-form-urlencoded',
        'Accept':           'application/json'
    }

    return headers;
}


exports.generateCandidateEntities = function(data, callBack) {
    var entities = data.entities
    ,   confidence = data.confidence
    ,   support = data.support,
        documentID = data.documentID,
        entitiesWithCandidates = [];

    
    async.forEach(entities, function (entity, callback){
        entity.candidates = [];
        queryDBPediaSpotlight(entity, confidence, support, function(candidateList){
            async.forEach(candidateList, function (candidate, callback){
                queryDBPediaLookup(candidate, function(candidateWithAdditionalData){
                    if(candidateWithAdditionalData != null) {
                        entity.candidates.push(candidateWithAdditionalData);
                    }

                    callback();
                });
            }, function(err) {
                entitiesWithCandidates.push(entity);
                callback();
            });
        });

    }, function(err) {
        callBack(entitiesWithCandidates);
    });
}

var queryDBPediaSpotlight = function(entity, confidence, support, callBack){
    //Now we query DBPedia Annotator
    var options = {
        url: 'http://www.dbpedia-spotlight.com/en/candidates',
        form: {
            text: entity.description,
            confidence: confidence,
            support: support,
            policy: 'whitelist'            
        },
        method: 'POST'
    };

    
    rest.postRequestJSON(options, function(statusCode, surfaceForms){
        
        var candidateList = [];
        if(surfaceForms.length != null){
            for(var i = 0; i < surfaceForms.length; i++) {
                for(var k = surfaceForms[i].resource.length - 1; k >= surfaceForms[i].resource.length - (Math.round(surfaceForms[i].resource.length * (surfaceForms.length/10))); k--){
                    var candidate = surfaceForms[i].resource[k];
                    
                    candidate.finalScore = parseFloat(Number(candidate.finalScore).toFixed(8));
                    candidate.rank = surfaceForms[i].resource.length - k;//First rank is 1 not 0
                    candidate.totalRank =  Math.round(surfaceForms[i].resource.length * (surfaceForms.length/10));
                    candidate.EntityMentionID = entity.id;
                    candidateList.push(candidate);
                }
            }
        } else {
            var condition = surfaceForms.resource.length <= 8 ? 0:surfaceForms.resource.length-8;
            var length = surfaceForms.resource.length;
            for(var k = length - 1; k >= condition; k--){
                var candidate = surfaceForms.resource[k];
                
                candidate.finalScore = parseFloat(Number(candidate.finalScore).toFixed(8));
                candidate.rank = length - k; //First rank is 1 not 0
                candidate.totalRank =  length - condition;
                candidate.EntityMentionID = entity.id;
                candidateList.push(candidate);
            }
            
        }
        callBack(candidateList);     
    });
}

var queryDBPediaLookup = function(candidate, callBack) {
    var type = "";
    if(candidate.types != null && candidate.types.length > 1){
        if(candidate.types[0].split(':')[1] != 'Agent')
            type = candidate.types[0].split(':')[1];
        else 
            type = candidate.types[1].split(':')[1]
    }

    var data = querystring.stringify({
        'QueryClass': type,
        'MaxHits': 1,
        'QueryString': candidate.label
    });

    var options = {
        url: 'http://lookup.dbpedia.org/api/search/PrefixSearch',
        method: 'GET',
        headers: getHeaders()
    };
    
    options.url += "?"+data;

    var newCandidate = candidate;
    rest.getRequestJSON(options, function(statusCode, candidateData){
        if(candidateData == null) {
            callBack();
        } else {
            newCandidate.description = utf8.encode(candidateData.description);
            newCandidate.dbpediaURI = candidateData.uri;
            newCandidate.categories = candidateData.categories;
            callBack(newCandidate);
        }   
    });
}
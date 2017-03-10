var models      = require('@brikendr/sequelize-models-annotateme/models');
var async       = require('async');

exports.findEntitiesByDocumentID = function(data, callBack){
    models.EntityMention.findAll({
        where: {
            documentID: data.documentID
        }
    }).then(function(entities){
        callBack(entities);
    });
}

exports.createEntityCollocations = function(data, callBack){
    var entities = data.entities;
    
    async.forEach(entities, function (entity, callback){
        async.forEach(entity.collocations, function (collocation, callback){ 
            saveCollocation(collocation, entity, function(savedCollocation){
                callback();
            });
        }, function(err) {
            callback();
        });

    }, function(err) {
        callBack();
    });
}

exports.createEntityCandidates = function(data, callBack){
    var entities = data.entities;

    async.forEach(entities, function (entity, callback){
        async.forEach(entity.candidates, function (candidate, callback){ 
            saveCandidate(candidate, entity, function(savedCandidate){
                callback();
            });
        }, function(err) {
            callback();
        });

    }, function(err) {
        callBack();
    });
}

var saveCollocation = function(collocation, entity, callBack) {
    models.Collocation.create({
        collocation_json: collocation.bigram,
        pos_json: collocation.pos,
        EntityMentionId: entity.id
    }).then(function(result){
        callBack(result);
    });
}

var saveCandidate = function(candidate, entity, callBack) {
    models.Candidate.create({
        candidate_name: candidate.label,
        description: candidate.description,
        schema_type: candidate.types,
        dbpediaURL: candidate.dbpediaURI,
        score: candidate.finalScore,
        rank: candidate.rank,
        total_rank: candidate.totalRank,
        EntityMentionId: candidate.EntityMentionID
    }).then(function(result){
        callBack();
    });
}
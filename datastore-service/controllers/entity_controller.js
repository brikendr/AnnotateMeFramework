var models      = require('@brikendr/sequelize-models-annotateme/models');
var async       = require('async');
var sequelize   = require('sequelize');

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

exports.triggerEntityResolution = function(entityID, callBack) {
    models.Annotation.findAll({
        where:{
            EntityMentionId: entityID,
            is_nil: {
                $not: true
            } 
        },
        attributes: ['CandidateId', `EntityMentionId`,[sequelize.fn('COUNT', sequelize.col('id')), 'nr_annotations']],
        group: ['Annotation.CandidateId'],
        order: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'DESC'],
        ],
        limit: 1
    }).then(function(result){
        var data = result[0].dataValues;
        if(data.nr_annotations >= 4) {
            resolveEntity(data.EntityMentionId, data.CandidateId);
            callBack();
        }
    });
}

var resolveEntity = function(entityID, candidateID) {
    models.EntityMention.update({
        is_resolved: true
    },
    {
        where: {
            id: entityID
        }
    }).then(function(updated){
        models.Candidate.update({
            is_correct: true
        },
        {
            where: {
                id: candidateID
            }
        });
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
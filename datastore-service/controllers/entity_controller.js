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

exports.triggerEntityResolution = function(entityID) {
    models.Annotation.findAll({
        where:{
            EntityMentionId: entityID
        },
        attributes: ['CandidateId', `EntityMentionId`,[sequelize.fn('COUNT', sequelize.col('id')), 'nr_annotations']],
        group: ['Annotation.CandidateId'],
        order: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'DESC'],
        ],
        limit: 1
    }).then(function(result){
        if(result[0] != null) {
            var data = result[0].dataValues;
            if(data.nr_annotations >= 4) {
                resolveEntity(data.EntityMentionId, data.CandidateId);
            }
        }
    });
}

exports.testCandidateGeneration = function(callBack){
    models.EntityMention.findAll({
        include: [models.Collocation]
    }).then(function(entities){
        var newEntities = [];
        async.forEach(entities, function (entity, callback){ 
            var sentance = "";
            getNeighborEntities(entity, function(neighborEntities){
                var isBefore = true;
                async.forEach(neighborEntities, function (neighborEntity, callback){ 
                    generateSentance(neighborEntity, entity,isBefore, function(generatedSentance, isBeforeCondition){
                        sentance += ", " + generatedSentance;
                        isBefore = isBeforeCondition;
                        callback();
                    });
                }, function(err) {
                    if(sentance.indexOf(entity.description) == -1){
                        async.forEach(entity.Collocations, function (collocation, callback){ 
                            sentance += ", " + collocation.collocation_json;
                            callback();
                        }, function(err) {
                            sentance += ", " + entity.description;
                        });
                    }
                    var e = {
                        'id': entity.id,
                        'description': entity.description,
                        'start_index': entity.start_index,
                        'end_index': entity.end_index,
                        'newDescription': sentance
                    };
                    entity.newDescription = sentance;
                    newEntities.push(e);
                    callback();
                });
            });
        }, function(err) {
            callBack(newEntities);
        });
    })
}

var generateSentance = function(neighborEntity, entity,isBefore, callBack) {
    var sentance = "";
    if(neighborEntity.end_index < entity.start_index) {
        sentance += ", " + neighborEntity.description;
    }
    else{
        if(isBefore) {
            isBefore = false;
            async.forEach(entity.Collocations, function (collocation, callback){ 
                sentance += ", " + collocation.collocation_json;
                callback();
            }, function(err) {
                sentance += ", " + entity.description;
            });
        }
        sentance += ", " + neighborEntity.description;
    }
    callBack(sentance, isBefore);
}

var getNeighborEntities = function(entity, callBack) {
    //ABS(91 - (`end_index` + `start_index`))
    var entityPos = entity.end_index + entity.start_index;
    models.EntityMention.findAll({
        where: {
            id: {
                $ne: entity.id
            },
            DocumentId: entity.DocumentId
        },
        order: [
            [sequelize.fn('ABS', sequelize.condition(sequelize.col('start_index'), '+', sequelize.col('end_index'))), 'ASC']
        ]
    }).then(function(result){
        var ordered = [];
        for (var i = 0; i < result.length; i++) {
            var distance = Math.abs(entityPos - (result[i].start_index + result[i].end_index));
            result[i].distance = distance;
        }

        result.sort(function(a, b){
            return a.distance - b.distance;
        });

        callBack(result.length > 4 ? result.slice(0, 4):result);
    });
}

exports.resolveEntity = function(entityID, candidateID) {
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
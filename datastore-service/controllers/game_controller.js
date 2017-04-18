var models      = require('@brikendr/sequelize-models-annotateme/models');
var async       = require('async');
var sequelize   = require('sequelize'),
    entityController = require('./entity_controller');

exports.createNewPerformanceHistory = function(playerId, type, value){
    models.PerformanceHistory.create({
        value: value,
        PlayerId: playerId,
        PerformanceHistoryTypeId: type
    });
}

exports.triggerEntityResolution = function(entityID) {
    models.Game.findAll({
        where:{
            EntityMentionId: entityID
        },
        attributes: ['CandidateId', `EntityMentionId`,[sequelize.fn('COUNT', sequelize.col('id')), 'nr_games']],
        group: ['Game.CandidateId'],
        order: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'DESC'],
        ],
        limit: 1
    }).then(function(result){
        if(result[0] != null) {
            var data = result[0].dataValues;
            if(data.nr_games >= 4) {
                entityController.resolveEntity(data.EntityMentionId, data.CandidateId);
            }
        }
    });
}
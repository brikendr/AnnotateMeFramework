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

exports.createChallenges = function(data, callBack) {
    var challenges = [];
    async.forEach(data.challengees, function (challengee, callback){
        saveChallenge(data, challengee, function(savedChallenge){
            callback();
        });
    }, function(err) {
        callBack(challenges);
    });
}

var saveChallenge = function(data, challengee, callBack) {
    models.Challenge.create({
        p1_wps: data.wpm,
        p2_wps: challengee.wpm,
        status: 0,
        challenged_points: data.challengedPoints,
        challengerId: data.player,
        challengeeId: challengee.challengerId,
        GameId: data.gameId,
    }).then(function(result){
        callBack(result);
    });
}

exports.getProfileStats = function(playerId, callBack) {
    getChallengerRatio(playerId, function(challengeRatio){
        //getChallengeeRatio(playerId, function(challengeeRation){
            getHighestWPM(playerId, function(highestWPM){
                getBettingRatio(playerId, function(bettingRatio){
                    getWpmPerformanceHistory(playerId, function(wpmPerformances){
                        callBack({
                            'challengeRatio': challengeRatio,
                            'highestWpm': highestWPM,
                            'bettingRatio': bettingRatio,
                            'wpmPerformances': wpmPerformances
                        });
                    });
                });
            });
        //});
    });
}

var getChallengerRatio = function(challengerId, callBack) {
    models.Challenge.findAll({
        attributes: ['status',[sequelize.fn('COUNT', sequelize.col('challengerId')), 'count']],
        where: {
            challengerId: challengerId,
            status: {$ne: 0}
        },
        group: ['Challenge.status'],
    }).then(function(c) {
        callBack(c);
    });

}

var getChallengeeRatio = function(challengerId, callBack) {
    models.Challenge.findAll({
        attributes: ['status',[sequelize.fn('COUNT', sequelize.col('challengerId')), 'count']],
        where: {
            challengeeId: challengerId,
            status: {$ne: 0}
        },
        group: ['Challenge.status'],
    }).then(function(c) {
        //Since we are querying challengeeId, the status should be the contrary if 2 means loose for challenger, that means win for challengee
        var challengeeRatio = [];
        for(var i = 0; i < c.length; i++) {
            console.log(JOSN.parse(c[i]));
            if(c[i].status != 3 && c[i].status != 6) {
                console.log("COUNT IS ", c[i].count);
                if(c[i].status == 1 || c[i].status == 4) {
                    challengeeRatio[i] = {
                        'status': c[i].status + 1,
                        'count': c[i]['count']
                    }
                } else if(c[i].status == 2 || c[i].status == 5) {
                    challengeeRatio[i] = {
                        'status': c[i].status - 1,
                        'count': c[i]['count']
                    }
                }
            } else {
                challengeeRatio[i] = c[i];
            }
        }
        console.log(challengeeRatio);
        console.log("CHALLENGEE COUNT ",challengeeRatio.length);
        callBack(challengeeRatio);
    });

}

var getHighestWPM = function(playerId, callBack){
    models.PerformanceHistory.max('value', { where: { PlayerId: playerId } }).then(function(max) {
        callBack(max);
    });
}

var getBettingRatio = function(playerId, callBack) {
    models.Game.count({ where: { PlayerId: playerId, isBetValidated: 1, betWon: 1} }).then(function(wonBets) {
        models.Game.count({ where: { PlayerId: playerId, betscore: {$gt: 0}} }).then(function(totalBets) {
            var bettingRatio = Math.round((wonBets / totalBets) * 100);
            callBack(bettingRatio);
        });
    });
}

var getWpmPerformanceHistory = function(playerId, callBack) {
    models.PerformanceHistory.findAll({
        attributes: ['value'],
        where: {
            PlayerId: playerId,
            PerformanceHistoryTypeId: 1
        },
        order: [ [ 'createdAt', 'DESC' ] ],
        limit: 10
    }).then(function(stats){
        callBack(stats);
    });
}


exports.getCategoriesWithStats = function(playerId,callBack) {
    var newCategories = [];
    countEntityMentionByCategories(function(categories){
        async.forEach(categories, function (category, callback){
            countResolvedEntitiesByCategory(playerId,category.id, function(totalResolved){
                newCategories.push({
                    'id': category.id,
                    'progress': Math.round((totalResolved / category.total_entities) *100),
                    'name': category.name,
                    'logo_path': category.logo_path
                });
                callback();
            });
        }, function(err) {
            callBack(newCategories);
        });
    });
}

var countEntityMentionByCategories= function(callBack) {
    models.Category.findAll({
        where: {
            total_entities: {$gt: 0}
        }
    }).then(function(categories){
        callBack(categories);
    })
}

var countResolvedEntitiesByCategory = function(playerId,categoryId, callBack) {
    models.Game.count({ 
        where: {  
            PlayerId: playerId 
        },
        include: [{
            model: models.EntityMention,
            where: { CategoryId: categoryId }
        }]
    }).then(function(totalResolved) {
        callBack(totalResolved);
    });
}
var models      = require('../models');
var async       = require('async');


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

var saveCollocation = function(collocation, entity, callBack) {
    models.Collocation.create({
        collocation_json: collocation.bigram,
        pos_json: collocation.pos,
        EntityMentionId: entity.id
    }).then(function(result){
        callBack(result);
    });
}
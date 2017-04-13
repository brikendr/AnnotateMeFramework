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
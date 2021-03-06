var models      = require('@brikendr/sequelize-models-annotateme/models');
var async       = require('async');

exports.createDocument = function(data, callBack){
    models.Document.create({
        path:  data.path,
        content: data.content,
        dataset: data.dataset,
        length_index: data.lengthIdx,
        nr_characters: data.numCharacter
    }).then(function(document){
        //Return Response
        callBack(document);
    });
}

exports.persistEntities = function(data, callBack) {
    var namedEntities   = data.entities,
    text                = data.text,
    documentID          = data.documentID,
    sentances           = data.sections,
    tokens              = data.tokensByWords;

    //Update Document information 
    models.Document.update({
        total_entries: namedEntities.length,
        length_index: sentances[sentances.length - 1].index + sentances[sentances.length - 1].index,
        nr_characters:  tokens.length
    }, {
        where: {
            id: documentID
        }
    });
    async.forEach(sentances, function (sentance, callback){
        saveSentance(sentance, documentID, function(savedSentance){
            
            async.forEach(namedEntities, function (entity, callback){ 
                saveEntity(entity, savedSentance, documentID, function(savedEntity){
                    callback();
                });
            }, function(err) {
                callback();
            });
        });

    }, function(err) {
        callBack();
    });
        
}

exports.persistKeywords = function(data, callBack) {
    models.Document.find({
        where: {
            id: data.documentID
        }
    }).then(function(document){
        if(!document){
            callBack(false);
        } else {
            //Insert Keywords 
            async.forEach(data.keywords, function (keyword, callback){
                saveKeyword(keyword.text, data.documentID, function(savedEntity){
                    callback();
                });
            }, function(err) {
                callBack(true);
            });
        }
    });
}

exports.findSentancesByDocumentID = function(data, callBack) {
    models.Sentance.findAll({
        where: {
            documentID: data.documentID
        },
        include: [models.EntityMention]
    }).then(function(result){
        callBack(result);
    });
}

var saveSentance = function(sentance, documentID, callBack) {
    models.Sentance.create({
        description: sentance.value,
        start_index: sentance.index,
        end_index: sentance.index + sentance.offset,
        DocumentId: documentID
    }).then(function(result){
        callBack(result);
    });
}

var saveEntity = function(entity, sentance, documentID, callBack) {
    var entityOffset = entity.index + entity.length;
    if (entityOffset >= sentance.start_index && entityOffset <= sentance.end_index) {
        models.EntityMention.create({
            description: entity.name,
            start_index: entity.index,
            end_index: entity.index + entity.length,
            DocumentId: documentID,
            SentanceId: sentance.id
        }).then(function(result){
            callBack(result);
        });
    } else {
        callBack();
    }
}

var saveKeyword = function(keyword, documentID, callBack) {
    models.Keyword.create({
        keyword:  keyword,
        DocumentId: documentID
    }).then(function(result){
        callBack(result);
    });
}


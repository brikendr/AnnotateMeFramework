var models      = require('@brikendr/sequelize-models-annotateme/models');
var sequelize   = require('sequelize');

exports.prepareTaskData = function(reqData, callBack){
    var exludedEntities = reqData.exludedEntities;
    console.log('prepareTaskData',reqData);

    //1. Create a string of exluded entity IDs to use for NOT IN query condition
    var NOT_IN = [];
    for(var i = 0; i < exludedEntities.length; i++) {
        NOT_IN[i] = exludedEntities[i];
    }
    //2. Query all entities from the table (exluding the ones that were annotated previously)
    getEntities(NOT_IN, function(entities){

        if(entities.length == 0) {
            callBack();
            return;
        }
        //3. Get the length of the entity list and generate a random number from zero to arraylist.length 
        var randomIDX = entities.length > 1 ? Math.floor(Math.random() * entities.length): 0;
        //var randomIDX = entities[randomIDX];

        //4. The random number will be the index of the entity that will be taken for evaluation 

        //5. Using the entity ID from 4, select max 4 neighbor entities (within the document using start_index and end_index)
        getNeighborEntities(entities[randomIDX], function(neighborEntities){

            //6. Using entity ID from 4, get all collocations of the entity mention 
            getEntityCollocations(entities[randomIDX], function(collocations){
                
                //7. Using entity id from 4, get all candidates of the entity mention (Select the first 2-3 schema types and not all of them!)
                getEntityCandidates(entities[randomIDX], function(candidates){
                    //8. After having fetched the candidates, shuffle the list so that it is randomly presented to the user 
                    shuffleCandidateList(candidates, function(shuffeledCandidateList){
                        filterCandidateTypes(shuffeledCandidateList, function(entityCandidates){
                            //9. Using documentID from the selected entity, get all the topic keywords
                            getDocumentKeywords(entities[randomIDX], function(keywords){
                                //10. Create a json object and return all the extracted data from 4-9.

                                var finalResult = {
                                    'entity': entities[randomIDX],
                                    'neighborEntities': neighborEntities,
                                    'collocations': collocations,
                                    'candidates': entityCandidates,
                                    'docKeywords': keywords
                                }

                                callBack(finalResult);
                            });
                        });
                        
                    })
                });
            });
            
        });
            
    });
}

exports.prepareNILEntity = function(reqData, callBack){
    console.log('PREPARE NIL');
    models.EntityMention.find({
        where: {
            id: 231,
        }
    }).then(function(entityMention){
        //Get Collocations
        getEntityCollocations(entityMention, function(collocations){    
            //7. Using entity id from 4, get all candidates of the entity mention (Select the first 2-3 schema types and not all of them!)
            getEntityCandidates(entityMention, function(candidates){
                //8. After having fetched the candidates, shuffle the list so that it is randomly presented to the user 
                shuffleCandidateList(candidates, function(shuffeledCandidateList){
                    filterCandidateTypes(shuffeledCandidateList, function(entityCandidates){
                        //9. Using documentID from the selected entity, get all the topic keywords
                        getDocumentKeywords(entityMention, function(keywords){
                            //10. Create a json object and return all the extracted data from 4-9.
                            var finalResult = {
                                'entity': entityMention,
                                'neighborEntities': [],
                                'collocations': collocations,
                                'candidates': entityCandidates,
                                'docKeywords': keywords
                            }

                            callBack(finalResult);
                        });
                    });
                    
                })
            });
        });
    });
}

var getEntities = function(exlcudedEntities, callBack) {
    if(exlcudedEntities.length == 0) {
        models.EntityMention.findAll({
            where: {
                is_resolved: false
            }
        }).then(function(result){
            callBack(result);
        });
    } else {
        models.EntityMention.findAll({
            where: {
                id: {
                    $notIn: exlcudedEntities
                },
                is_resolved: false
            }
        }).then(function(result){
            callBack(result);
        });
    }
    
}

exports.getNeighborEntities = function(entity, callBack) {
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

var getEntityCollocations = function(entity, callBack) {
    models.Collocation.findAll({
        where: {
            EntityMentionId: entity.id
        }
    }).then(function(result){
        callBack(result);
    });
}

var getEntityCandidates = function(entity, callBack) {
    models.Candidate.findAll({
        where: {
            EntityMentionId: entity.id
        }
    }).then(function(result){   
        callBack(result);
    });
}

exports.shuffleCandidateList = function(candidates, callBack) {
    for (var i = candidates.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = candidates[i];
        candidates[i] = candidates[j];
        candidates[j] = temp;
        
    }
    callBack(candidates);
}

exports.getDocumentKeywords = function(entity, callBack) {
    models.Keyword.findAll({
        where: {
            DocumentId: entity.DocumentId
        }
    }).then(function(result){
        callBack(result);
    });
}

exports.filterCandidateTypes = function(candidates, callBack) {
    for(var i=0; i < candidates.length; i++) {
        var schemaTypes = candidates[i].schema_type;

        if(schemaTypes != null && schemaTypes.length > 0) {

            var schemaTypes = schemaTypes.split(",");
            var previewTypes = "";
            var nrOfAssignedTypes = 0;
            for(var k=0; k < schemaTypes.length; k++) {
                var actualType = schemaTypes[k].split(":");
                if(nrOfAssignedTypes == 3)
                    break;
                    
                if(actualType[0].trim() != "Http" && previewTypes.indexOf(actualType[1]) == -1) {
                    previewTypes += actualType[1] + ",";
                    nrOfAssignedTypes++;
                }                    
            }
            candidates[i].schema_type = previewTypes.substring(0, previewTypes.length - 1);
        }
    }

    callBack(candidates);
}
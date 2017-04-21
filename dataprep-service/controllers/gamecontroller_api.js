var models      = require('@brikendr/sequelize-models-annotateme/models');
var sequelize   = require('sequelize'),
    annotateme_controller = require('./annotateme_api');

exports.prepareGameData = function(reqData, callBack){
    var playerID    = reqData.playerId,
        categoryID  = reqData.categoryId;
    console.log('prepareGameData',reqData);


    
    //1. Query all entities from the table (exluding already annotated from the player and who belong in the specified category)
    getEntities(playerID, categoryID, function(entities){

        if(entities.length == 0) {
            callBack();
            return;
        }
        //2. Get the length of the entity list and generate a random number from zero to arraylist.length 
        var randomIDX = entities.length > 1 ? Math.floor(Math.random() * entities.length): 0;
        //var randomIDX = entities[randomIDX];

        //3. The random number will be the index of the entity that will be taken for evaluation 

        //4. Using the entity ID from 2, select max 4 neighbor entities (within the document using start_index and end_index)
        annotateme_controller.getNeighborEntities(entities[randomIDX], function(neighborEntities){
            //5. Using entity id from 2, get best 5 (+1 being "none") candidates based on their rank
            getEntityCandidates(entities[randomIDX], function(candidates){
                //8. After having fetched the candidates, shuffle the list so that it is randomly presented to the user 
                annotateme_controller.shuffleCandidateList(candidates, function(shuffeledCandidateList){
                    annotateme_controller.filterCandidateTypes(shuffeledCandidateList, function(entityCandidates){
                        //9. Using documentID from the selected entity, get all the topic keywords
                        annotateme_controller.getDocumentKeywords(entities[randomIDX], function(keywords){
                            //10. Create a json object and return all the extracted data from 4-9.

                            var finalResult = {
                                'entity': entities[randomIDX],
                                'neighborEntities': neighborEntities,
                                'candidates': entityCandidates,
                                'docKeywords': keywords
                            }
                            callBack(finalResult);
                        });
                    }); 
                });
            });
        });
    });
}

var getEntities = function(playerId, categoryID, callBack) {
    //First, find all IDs used by the player on a game 
    models.Game.findAll({
        attributes: ['EntityMentionId'],
        where: {
            PlayerId: playerId
        }
    }).then(function(playedEntities){
        var excludedEntities = [];
        for(var i = 0; i < playedEntities.length; i++) {
            excludedEntities.push(playedEntities[i].EntityMentionId);
        }
        console.log(excludedEntities);
        //NOW construct the where clause, based on if categoryId is provided or not 
        var whereClause = {
            is_resolved: false,
            id: {$notIn: playedEntities}
        }
        if(excludedEntities.length > 0) {
            if(categoryID != null) { 
                console.log('WITH THE CATEGORY ', categoryID);
                models.EntityMention.findAll({
                    where:{
                        is_resolved: false,
                        id: {$notIn: excludedEntities},
                        CategoryId: categoryID
                    },
                    include: [models.Sentance, models.Collocation]
                }).then(function(result){
                    callBack(result);
                });
            } else {
                console.log('WITHOUT THE CATEGORY ');
                models.EntityMention.findAll({
                    where:{
                        is_resolved: false,
                        id: {$notIn: excludedEntities}
                    },
                    include: [models.Sentance, models.Collocation]
                }).then(function(result){
                    callBack(result);
                });
            }
        } else {
            if(categoryID != null) { 
                console.log('WITH THE CATEGORY ', categoryID);
                models.EntityMention.findAll({
                    where:{
                        is_resolved: false,
                        CategoryId: categoryID
                    },
                    include: [models.Sentance, models.Collocation]
                }).then(function(result){
                    callBack(result);
                });
            } else {
                console.log('WITHOUT THE CATEGORY ');
                models.EntityMention.findAll({
                    where:{
                        is_resolved: false
                    },
                    include: [models.Sentance, models.Collocation]
                }).then(function(result){
                    callBack(result);
                });
            }
        }
        
    });    
}


var getEntityCandidates = function(entity, callBack) {
    models.Candidate.findAll({
        where: {
            EntityMentionId: entity.id
        },
        order: [['rank', 'ASC']],
        limit: 5
    }).then(function(result){   
        callBack(result);
    });
}

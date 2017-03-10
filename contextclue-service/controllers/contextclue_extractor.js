var pos         = require('pos');
var tagger      = new pos.Tagger();
var stopwords   = require('stopword');

exports.extractContextClues = function(data, callBack){
    var documentID      = data.documentID,
        sentances       = data.sentances,
        sentanceRestricted  = data.sentanceRestricted || false,
        collocations    = [],
        allEntities     = [];

    // Loop through each sentance 
    for (var i = 0; i < sentances.length; i++) {
        var sentance = sentances[i];

        //Remove Stopwords such as the, is, at, which, a, an and on.
        const sentanceTokens = stopwords.removeStopwords(sentance.description.split(' '));

        var sentanceCollocations = generateLocalCollocationsForSentance(sentance, sentanceTokens);

        collocations.push.apply(collocations, sentanceCollocations.collocations);

        // If sentance restricted, we associate only collocation occurring in the sentance with the corresponding entities
        if(!sentanceRestricted)
            allEntities.push.apply(allEntities, sentanceCollocations.entities);
        else 
            allEntities.push.apply(allEntities, associateCollocationsWithEntity(sentanceCollocations.entities, sentanceCollocations.collocations));
    }

    // If we dont have sentance restricted, then we call the associateCollocation function with all collocations in all sentances to be linked with each entity 
    if(!sentanceRestricted)
        allEntities = associateCollocationsWithEntity(allEntities, collocations);

    callBack(allEntities);
}

var associateCollocationsWithEntity = function(allEntities, collocations) {
    var entities = allEntities;
    
    for(var i = 0; i < entities.length; i++) {
        var entity = entities[i],
            entityStartIdx = entity.start_index,
            entityEndIdx = entity.end_index,
            tempEntityCollocationArray = [],
            preceedingBigrams = 0,
            subsequentBigrams = 0,
            entityCollocationBorderline = 0,
            borderlineAssigned = false;
        
        //Initialize collocation array for the entity
        entity.collocations = [];
        
        //loop through each collocation 
        for(var j = 0; j < collocations.length; j++) {
            var collocation = collocations[j],
                collocationIdx = collocation.startIDX,
                collocatioOffset = collocation.endIDX;

            // If we have passed the preceeding collocations, before adding the next subsequent collocation we need to know the border
            if(collocatioOffset > entityStartIdx && !borderlineAssigned){
                // We are processing subsequent collocations now, the last element in array inserted is the borderline
                entityCollocationBorderline = tempEntityCollocationArray.length;
                borderlineAssigned = true;
            }

            // Add collocation to e temporary array
            tempEntityCollocationArray.push(collocation);
            
            /*increase proceedingCollocations++ and subsequentCollocations++ based on their position
            - NOTE: collocations are saved in the array in ascendent order so when you are processing 
            preceeding collocations towards the target entity, and you get a new collocation that is a 
            subsequent collocation, save the entity to the temporary array and save the index where it was saved.
            */
            collocatioOffset < entityStartIdx ? preceedingBigrams++:subsequentBigrams++;
        }
        
        if(subsequentBigrams >= 2 && preceedingBigrams >= 2) {
            
            entity.collocations.push(tempEntityCollocationArray[entityCollocationBorderline-2]);
            entity.collocations.push(tempEntityCollocationArray[entityCollocationBorderline-1]);
            entity.collocations.push(tempEntityCollocationArray[entityCollocationBorderline]);
            entity.collocations.push(tempEntityCollocationArray[entityCollocationBorderline+1]);
            
        }
        else if(subsequentBigrams < 2 && preceedingBigrams >=2) {
            for(var k = 0; k < entityCollocationBorderline; k++) {
                entity.collocations.push(tempEntityCollocationArray[k]);
            }

            for(var k = entityCollocationBorderline; k <= (2+(2-subsequentBigrams)); k++) {
                if(k < tempEntityCollocationArray.length){
                    entity.collocations.push(tempEntityCollocationArray[k]);
                } else {
                    break;
                }
            }
            
        } 
        else if(subsequentBigrams >= 2 && preceedingBigrams < 2) {
            for(var k = entityCollocationBorderline; k < tempEntityCollocationArray.length; k++) {
                entity.collocations.push(tempEntityCollocationArray[k]);
            }
            
            for(var k = entityCollocationBorderline - 1; k >= tempEntityCollocationArray.length - subsequentBigrams; k--) {
                entity.collocations.push(tempEntityCollocationArray[k]);
            }
        } else {
            //Take all preceeding and subsequent collocations 
            entity.collocations.push.apply(entity.collocations, tempEntityCollocationArray);
        }
        
        entity.collocations = orderCollocationsBasedOnEntityProximity(entity, entity.collocations, entityCollocationBorderline, subsequentBigrams);
    }

    return entities;
}


var orderCollocationsBasedOnEntityProximity = function(entity, collocations, borderline , subsequentBigrams) {
    var orderedCollocations = [];
    //If there are no subsequent bigrams, this means the borderline has not changed, but we need it to represent the index after the last last element (preceeding bigram) of the array which in this case will be nr of elements in collocation array (length)
    if(subsequentBigrams == 0)
        borderline = collocations.length;

    for(var i = borderline, j = collocations.length - subsequentBigrams - 1; i < collocations.length || j >= 0; i++,j--) {
        //Add preceeding collocation, 80 is the distance of collocation and entity mention in characters (we dont take a collocation if its more than 80 characters away from entity)
        if(j >= 0 && entity.start_index - collocations[j].endIDX <= 80 ){
            orderedCollocations.push(collocations[j]);
        }
            
        if(i < collocations.length && collocations[i].startIDX - entity.end_index <= 80) {
            //Add sunsequent collocation
            orderedCollocations.push(collocations[i]);
        }
    }
    return orderedCollocations;
}


var generateLocalCollocationsForSentance = function(sentance, tokens){
    var EntityMentions = "",
        collocations = [],
        allEntityMentions = [],
        sentanceIdx = sentance.start_index,
        sentanceOffset = sentance.end_index;
    //Convert entity mentions to string with space separated ex: "State University of New York at Cortland Barack Obama John Segall"
    for(var i=0; i < sentance.EntityMentions.length; i++) {
        var entity = sentance.EntityMentions[i];
        EntityMentions += ' '+entity.description;
        entity.sentanceIDX = sentanceIdx;
        entity.sentanceOffset = sentanceOffset;
        allEntityMentions.push(entity);
    }
    

    // Loop through all available tokens 
    for(var i = 0; i < tokens.length; i++) {
        var token1 = tokens[i];
        var idx1   = sentance.description.indexOf(token1) + sentanceIdx;
        
        var words1 = new pos.Lexer().lex(token1);
        var tag1 = tagger.tag(words1)[0][1];

        // Check for nextToken in array 
        if(i < tokens.length -1) {
            var token2 = tokens[i+1];
            var idx2   = sentance.description.indexOf(token2) + sentanceIdx;
        
            var word2 = new pos.Lexer().lex(token2);
            var tag2 = tagger.tag(word2)[0][1];

            // Check first that the bigram does not occur in the entity list 
            if(EntityMentions.indexOf(token1) == -1 && EntityMentions.indexOf(token2) == -1) {
                /* 
                Combination Rules to be satisfied in order to take the bigram 
                - Adjective_Noun - JJ/JJR/JJS_NN/NNP/NNPS/NNS
                - Noun_Adjective - NN/NNP/NNPS/NNS_JJ/JJR/JJS
                - Verb_Noun ------ VBZ/VBP/VBG/VBD_NN/NNP/NNPS/NNS
                - Noun_Noun ------ NN/NNP/NNPS/NNS_NN/NNP/NNPS/NNS
                */
                if( (['JJ', 'JJR', 'JJS'].indexOf(tag1) != -1 && ['NN', 'NNP', 'NNPS', 'NNS'].indexOf(tag2) != -1) ||
                    (['NN', 'NNP', 'NNPS', 'NNS'].indexOf(tag1) != -1 && ['JJ', 'JJR', 'JJS'].indexOf(tag2) != -1) ||
                    (['VBZ', 'VBP', 'VBG', 'VBD', 'FW'].indexOf(tag1) != -1 && ['NN', 'NNP', 'NNPS', 'NNS'].indexOf(tag2) != -1) ||
                    (['NN', 'NNP', 'NNPS', 'NNS'].indexOf(tag1) != -1 && ['NN', 'NNP', 'NNPS', 'NNS'].indexOf(tag2) != -1)) {
                    
                    //Add collocation to the array 
                    collocations.push({
                        'bigram':  token1.concat(' '+token2),
                        'pos': tag1.concat('_'+tag2),
                        'startIDX': idx1,
                        'endIDX': (idx2 + token2.length),
                        'sentanceIDX': sentanceIdx,
                        'sentanceOffset': sentanceOffset
                    });
                }
            }
        }
    }

    //Return generated collocations 
   return {
        'collocations': collocations,
        'entities': allEntityMentions
   };
}
var Tokenizer   = require('tokenize-text');
var tokenize    = new Tokenizer();
var pos         = require('pos');
var tagger      = new pos.Tagger();

/**
 * tokenizeText:    Tokenize the text parameter into tokens and return it as json.
 * @param text:     The text data to be processed.
 * @param callback: callback to pass the results JSON object(s) back
 */
exports.tokenizeText = function(text, onResult){
    console.log("tokenizer::TokenizeText");
    var tokens = tokenize.words()(text);
    var tokens2 = text.split(/\s*\b\s*/);
    var sections = tokenize.sections()(text);
    onResult(tokens, tokens2, sections);
};


/**
 * mentionSelection:        Algorithm for mergning and selecting the correct entity mention taken from Dbpedia and Stanford NER.
 * @param text:             The text data to be processed.
 * @param stanfordEntities: The entities identified by StanfordNER
 * @param dbPediaEntities:  The entities identified by DBpedia Spotlight
 * @param callback:         Callback to pass the results JSON object(s) back
 */
exports.mentionSelection = function(text, stanfordEntities, dbPediaEntities, onResult) {
    console.log("tokenizer::mentionSelection");
    var nerEntities = [];
    var newEntities = [];
    // Loop through entities recognized by Stanford NER
    for (var key in stanfordEntities) {
        nerEntities.push.apply(nerEntities, stanfordEntities[key]);
    }


    
    loop1: 
    for(var i = 0; i < dbPediaEntities.length; i++) {
        var dbpediaEntity = dbPediaEntities[i].name;
        var idx1 = text.indexOf(dbpediaEntity);
        var length1 = dbpediaEntity.length;

        loop2:
        for(var j = 0; j < nerEntities.length; j++) {
                var stanfordEntity = nerEntities[j];
                var idx = text.indexOf(stanfordEntity);
                var length2 = stanfordEntity.length;

                if((idx1 > idx) && (idx1+length1 <= idx+length2)){
                    //The dbpedia entity is part of the ner entity, so we take the ner entity
                    newEntities.push({
                        "name": stanfordEntity,
                        "index": idx,
                        "length": length2
                    });
                    nerEntities.splice(j, 1);
                    break loop2;
                } else if((idx > idx1) && (idx+length2 <= idx1+length1)) {
                    //The ner entity is part of the dbpedia entity, so we take the dbpedia entity
                    newEntities.push({
                        "name": dbpediaEntity,
                        "index": idx1,
                        "length": length1
                    });
                    //break loop2;
                } else if (idx == idx1 && idx+length2 == idx1+length1) {
                    //Both have recognized the same entity, so we can take either of them
                    newEntities.push({
                        "name": stanfordEntity,
                        "index": idx,
                        "length": length1
                    });
                    nerEntities.splice(j, 1);
                    break loop2;
                }
            }
    }

    //Append what is left from the nerEntities array 
    for(var i = 0; i < nerEntities.length; i++) {
        var idx = text.indexOf(nerEntities[i]);
        var length = nerEntities[i].length;
        newEntities.push({
            "name": nerEntities[i],
            "index": idx,
            "length": length
        });
    }

    onResult(newEntities);
}

/**
 * mentionMerging:          Algorithm for mergning separate identified entities.
 * @param entities:         The identified entity list.
 * @param tokens:           The list of word tokes (punctuations included) where the entities are part of.
 * @param callback:         Callback to pass the results JSON object(s) back
 */
exports.mentionMerging = function(entities, tokens, callback) {
    console.log("tokenizer::mentionMerging");
    /*PATTERN:
    To deal with this problem, we developed a mention merging algorithm. Given a
    mention, the algorithm attempts to expand it to cover the next mention. Such
    expansion is permitted only if the second mention immediately follows the first
    one or if the mentions are separated by one of these patterns: a word, a comma,
    a comma followed by a word, a period or a period followed by a word.
    */
    var mergedEntities = [];
    
    //Loop through all recognized entities
    for(var i=0; i < entities.length; i++) {
        //Get enttiy in the current loop 
        var currentEntity = entities[i];

        // Locate entity in the tokens sequence, targetTokenIdx is the last word if the entity is a word composition
        var idxFirst = getEntityOccurrance(currentEntity, tokens, 2);
        
        // Check for nextEntity in array 
        if(i < entities.length-1) {
            //Get next entity mention 
            var nextEntity = entities[i+1];

            //Locate next entity in the tokens sequence, targetTokenIdx is the first word if the entity is a word composition
            var idxNext = getEntityOccurrance(nextEntity, tokens, 1);
            
            //If there are no tokens between entities, we merge them 
            var diff = idxNext - idxFirst;
            if(diff == 1) {
                //Merge the two entities
                var mergedEntity = mergeTwoEntities(currentEntity, nextEntity, "");
                mergedEntities.push(mergedEntity);

                //Remove the two entities from the original array
                entities.splice(i,2);

                //Append whats left from entities array into the mergedEntities array
                mergedEntities.push.apply(mergedEntities, entities);

                //Recursively call the function with the merged entities and whats left from original entity array
                return this.mentionMerging(mergedEntities, tokens, callback);
            }
            /* If there is one token between the entities and if those tokens are one of:
                - a word (whatever word but not an entity)
                - a comma 
                - a period
            */
            else if(diff == 2) {
                if(tokens[idxNext-1] == "." || tokens[idxNext-1] == "," || !checkIfTokenIsEntity(tokens[idxNext-1], entities)){
                    //Merge the two entities
                    var mergedEntity = mergeTwoEntities(currentEntity, nextEntity, tokens[idxNext-1]);
                    mergedEntities.push(mergedEntity);

                    //Remove the two entities from the original array
                    entities.splice(i,2);

                    //Append whats left from entities array into the mergedEntities array
                    mergedEntities.push.apply(mergedEntities, entities);

                    //Recursively call the function with the merged entities and whats left from original entity array
                    return this.mentionMerging(mergedEntities, tokens, callback);
                }
            }
            /* If there are two tokens between the entities and if those tokens are one of:
                - a comma followed by a word (not an entity word)
                - a period followed by a word (not an entity word)
            */
            else if(diff == 3) {
                if((tokens[idxNext-2] == "." || tokens[idxNext-2] == ",") && !checkIfTokenIsEntity(tokens[idxNext-1], entities)) {
                    //Merge the two entities
                    var mergedEntity = mergeTwoEntities(currentEntity, nextEntity, tokens[idxNext-2].concat(tokens[idxNext-1]));
                    mergedEntities.push(mergedEntity);

                    //Remove the two entities from the original array
                    entities.splice(i,2);

                    //Append whats left from entities array into the mergedEntities array
                    mergedEntities.push.apply(mergedEntities, entities);

                    //Recursively call the function with the merged entities and whats left from original entity array
                    return this.mentionMerging(mergedEntities, tokens, callback);
                }
            } else {
                // The entities are indeed separate, so we push the first 
                mergedEntities.push(currentEntity);
            }
        } else {
            // it is the last entity in array, so we merge it into the mergedEntities array
            mergedEntities.push(currentEntity);
        }
    }

    //Return callback function with the merged entities
    callback(mergedEntities);
};

/**
 * mentionFiltering:        Algorithm for filtering entity mentions that contain verbs.
 * @param entities:         The identified entity list.
 * @param callback:         Callback to pass the results JSON object(s) back
 */
exports.mentionFiltering = function(entities, callback) {
    console.log("tokenizer::mentionFiltering");
    var filteredEntities = [];

    loop1:
    for(var i = 0; i < entities.length; i++) {
        var words = new pos.Lexer().lex(entities[i].name);
        var taggedWords = tagger.tag(words);
        for(var j=0; j < taggedWords.length; j++) {
            var tag = taggedWords[j][1];
            /*
            * Check if the entity mention contain any verb in it 
            * (Not verbs that are compose the entity, such as United States, word United is a verb but 
            * should not be considered in this case, therefore we chack if the first letter of the word 
            * is not capital leter and if the word is a verb). 
            * If se we remove it from the list of entities 
            */
            if(!/[A-Z]/.test(taggedWords[j][0][0]) && (tag == "VB" || tag == "VBD" || tag == "VBG" || tag == "VBN" || tag == "VBP" || tag == "VBZ"))
                break loop1;
        }

        //Append entity element to the filteredEntities array
        filteredEntities.push(entities[i]);
    }

    //Return callback function with the filtered entities
    callback(filteredEntities);
}


/**
 * getEntityOccurrance:     Function that finds the occurrance of an entity in the tokens array, 
 *                          and returns the index of the first or last word (if the entity is a 
 *                          composition of words) depending on the value of third parameter.
 * @param entity:           The entity object.
 * @param tokens:           The list of word tokes (punctuations included) where the entity is part of.
 * @param targetTokenIdx:   Tells the function whether to take the first or last word of the entity (in case entity is a composition of words)
 */
var getEntityOccurrance = function(entity, tokens, targetTokenIdx){
    var entityTokens = entity.name.split(" ");
    var index = tokens.indexOf(entityTokens[targetTokenIdx == 1 ? 0:entityTokens.length - 1]);
    return index;
}

/**
 * checkIfTokenIsEntity:    Function that checks if a token is part of the entity list.
 * @param token:            The token (word) to be checked.
 * @param entities:         The list named entities.
 */
var checkIfTokenIsEntity = function(token, entities) {
    var pos = entities.map(function(e) { return e.name; }).indexOf(token);
    return pos == -1 ? false:true;
}

/**
 * mergeTwoEntities:        Function that merges two entities in one named entity mention.
 * @param entity1:          The first named entity.
 * @param entity2:          The second named entity.
 * @param betweenTokens     Any tokens that will be put between the entities (word, comma, period)
 */
var mergeTwoEntities = function(entity1, entity2, betweenTokens) {
    return {
        'name': entity1.name.concat(" "+betweenTokens.concat(" "+entity2.name)),
        'index': entity1.index,
        'length': (entity2.index - entity1.index) + entity2.length
    };
}

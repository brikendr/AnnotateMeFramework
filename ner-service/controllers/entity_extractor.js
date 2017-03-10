var querystring = require('querystring');
var rest = require("./rest");
var tokenizer = require('./tokenizer');

/* Headers that are used for querying DBpedia spotlight */
var getHeaders = function() {
    var headers = {
        'Content-Type':     'application/x-www-form-urlencoded',
        'Accept':           'application/json'
    }

    return headers;
}

/* Default options used when performing a request (GET, POST) */
var getParseOptions = function(){
    var options = {
        host: process.env.STANFORDNER_HOST || '127.0.0.1', 
        port: 80,
        path: '',
        method: 'GET',
        headers: getHeaders()
    };

    return options;
}

/* POST method for extracting the entities from a given text. */
exports.namedEntityExtractor = function(data, exchange, callBack){
    var textData = data.textData
    ,   confidence = data.confidence
    ,   support = data.support,
        documentID = data.documentID;
    
    //Tokenize text data 
    tokens = tokenizer.tokenizeText(textData, function(tokens, tokens2, sections){
        
        var options = getParseOptions();
        var data = querystring.stringify({
            'query' : textData
        });

        options.path = "?"+data;

        console.log("Making a GET requerst to "+options.host+":"+options.port);
        //Call the method that extracts entities using Stanford NER
        rest.getJSON(options, function(statusCode, NEREntities){
            var stanfordEntities = [];
            
            //Now we query DBPedia Annotator
            options = {
                url: 'http://www.dbpedia-spotlight.com/en/candidates',
                form: {
                    text: textData,
                    confidence: confidence,
                    support: support
                }
            }

            //Call the method that extracts spots(surface forms) using DBpedia Spotlight 
            rest.postRequestJSON(options, function(statusCode, AnnotatorEntities){
                console.log('Nr of dbpedia entities ', AnnotatorEntities.length);
                //Execute the mention selection algorithm on both sets
                tokenizer.mentionSelection(textData, NEREntities, AnnotatorEntities, function(selectedEntities){
                    
                    //Execute the mention merging algorithm 
                    tokenizer.mentionMerging(selectedEntities, tokens2, function(mergedEntities){
                        //Execute the mention filtering algorithm 
                        tokenizer.mentionFiltering(mergedEntities, function(filteredEntities){

                            var finalResult = {
                                "status"                : statusCode,
                                "text"                  : textData,
                                "documentID"            : documentID,
                                "entities"              : filteredEntities,
                                "stanford"              : NEREntities,
                                "dbpedia"               : AnnotatorEntities,
                                "sections"              : sections,
                                "tokensWithPunctuations": tokens2,
                                "tokensByWords"         : tokens,
                                'confidence'            : confidence,
                                'support'               : support,
                                'nrKeywordsToExtract'   : data.nrKeywordsToExtract,
                                'nrConceptsToExtract'   : data.nrConceptsToExtract
                            }
                            console.log('Everything went smooth, calling publish!');
                            //Return callback
                            callBack(finalResult);
                        });
                    });
                    
                });
                
            }); 
        });  
    }); 
};
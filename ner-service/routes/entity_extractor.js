var express = require('express');
var router = express.Router();
var rest = require("./../controllers/rest");
var tokenizer = require('./../controllers/tokenizer');
var querystring = require('querystring');



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
router.post('/extractentities', function(req, res, next) {
    var textData = req.body.textData
    ,   confidence = req.body.confidence
    ,   support = req.body.support;
    
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
                url: 'http://www.dbpedia-spotlight.com/en/spot',
                form: {
                    text: textData,
                    confidence: confidence,
                    support: support
                }
            }

            //Call the method that extracts spots(surface forms) using DBpedia Spotlight 
            rest.postRequestJSON(options, function(statusCode, AnnotatorEntities){

                //Execute the mention selection algorithm on both sets
                tokenizer.mentionSelection(textData, NEREntities, AnnotatorEntities, function(selectedEntities){
                    
                    //Execute the mention merging algorithm 
                    tokenizer.mentionMerging(selectedEntities, tokens2, function(mergedEntities){
                        //Execute the mention filtering algorithm 
                        tokenizer.mentionFiltering(mergedEntities, function(filteredEntities){
                            res.json({
                                "status": statusCode,
                                "text": textData,
                                "entities": filteredEntities,
                                "sections": sections,
                                "tokens1": tokens2,
                                "tokens": tokens
                            });
                        });
                    });
                    
                });
                
            }); 
        });  
    }); 
});


module.exports = router;
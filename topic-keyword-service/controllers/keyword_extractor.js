var AlchemyAPI = require('alchemy-api');


var alchemy = new AlchemyAPI('677da5a6dcd0f926b342fc1d2d9527e24364cc90');

exports.extractKeywords = function(data, callBack) {
    console.log('keywordExtractor::extractKeywords')
    var textData = data.textData,
    nrOfKeywords = data.nrKeywordsToExtract,
    nrOfConcepts = data.nrConceptsToExtract;
    
    alchemy.keywords(textData, {}, function(err, response) {
        if (err) throw err;
        var keywords = response.keywords;
        alchemy.concepts(textData, {}, function(err, response) {
            if (err) throw err;
            
            var concepts = response.concepts;
            
            var finalResult = [];
            //Extract nrOfKeywords most relevat keywords
            if(keywords.length > nrOfKeywords) {
                keywords.splice(nrOfKeywords);
                finalResult.push.apply(finalResult, keywords);
            } else {
                finalResult.push.apply(finalResult, keywords);
            }
            
            //Extract only the nrOfConcepts first relevant concepts 
            if(concepts.length > nrOfConcepts) {
                concepts.splice(nrOfConcepts)
                finalResult.push.apply(finalResult, concepts);
            } else {
                finalResult.push.apply(finalResult, concepts);
            }

            callBack(finalResult);
        });
    });
    
}
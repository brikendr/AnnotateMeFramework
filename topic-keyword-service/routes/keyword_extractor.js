var express = require('express');
var router  = express.Router();
var keywordExtractor = require('./../controllers/keyword_extractor');

/* POST method for extracting the topic keywords (main keywods) from the provided text.*/
router.post('/extractkeywords', function(req, res, next){
    keywordExtractor.extractKeywords(req.body, function(keywords){
        res.json(keywords);
    });
});

module.exports = router;
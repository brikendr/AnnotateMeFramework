var express = require('express');
var router  = express.Router();
var contextExtractor = require('./../controllers/contextclue_extractor');

/* POST method for extracting context clues for the given entities */
router.post('/extract/context/clues', function(req, res, next) {
    contextExtractor.extractContextClues(req.body, function(result){
        res.json(result);
    });
});

module.exports = router;
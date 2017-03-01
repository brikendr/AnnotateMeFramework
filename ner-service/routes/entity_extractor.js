var express = require('express');
var router = express.Router();
var entityExtractor = require('./../controllers/entity_extractor');


/* POST method for extracting the entities from a given text. */
router.post('/extractentities', function(req, res, next) {
    entityExtractor.namedEntityExtractor(req.body, null, function(result){
        res.json(result);
    });
});


module.exports = router;
var express = require('express');
var router = express.Router();
var candidateGenerator = require('./../controllers/candidate_generator');


/* POST method for extracting the entities from a given text. */
router.post('/generatecandidates', function(req, res, next) {
    candidateGenerator.generateCandidateEntities(req.body, null, function(result){
        res.json(result);
    });
});


module.exports = router;
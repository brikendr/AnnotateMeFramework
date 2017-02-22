var router      = require('express').Router();  
var models      = require('../models');


//GET ALL Annotations
router.get('/', function(req, res, next){
    models.Annotation.findAll().then(function(result){
        res.json(result);
    });
});

//GET Annotation by ID
router.get('/:id', function(req, res, next){
    models.Annotation.find({
        where: {
            id: req.params.id
        }
    }).then(function(result){
        if(!result){
            res.json({
                "status": 404,
                "errorMsg": "Resource not found!"
            });
        }

        res.json({
            "status": 200,
            "resource": result
        });
    });
});

//Create new annotation entry 
router.post('/', function(req, res, next){
    models.Annotation.create({
        is_nil: req.body.isNil,
        EntityMentionId: req.body.entityId,
        ParticipantId: req.body.participantId,
        CandidateId: req.body.candidateId,
        timespan: Date.now()
    }).then(function(result){
        //Return Response
        res.json({
            "status": 201,
            "resource": result,
            "resourceLink": "/participants/"+req.params.id+"/annotations/"+result.id,
            "parentLink": "/participants/"+req.params.id
        });
    });
});

//Update Annotation
router.put('/:id', function(req, res, next){
    models.Annotation.update({
        is_nil: req.body.isNil,
        EntityMentionId: req.body.entityId,
        ParticipantId: req.body.participantId,
        CandidateId: req.body.candidateId,
        timespan: Date.now()
    },
    {   
        where: {
            id: req.params.id
        }
    }).then(function(updated){
        if(updated == 0) {
            res.json({
                "status": 404,
                "errorMsg": "Resource not found!"
            });
        }

        res.json({
            "status": 200,
            "msg": "Resource Updated!"
        });

    });
});

//DELETE Annotation 
router.delete('/:id', function(req, res, next){
    models.Annotation.destroy({
        where: {
            id: req.params.id
        }
    }).then(function(deleted){
        if(deleted == 0) {
            res.json({
                "status": 404,
                "errorMsg": "Resource not found!"
            });
        }

        res.json({
            "status": 200,
            "msg": "Resource Deleted!"
        });

    });
});

module.exports = router;
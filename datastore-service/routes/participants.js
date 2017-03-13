var express     = require('express');
var router      = express.Router();
var models      = require('@brikendr/sequelize-models-annotateme/models');


//GET All Participants 
router.get('/', function(req, res, next) {
    models.Participant.findAll().then(function(result){
        res.json(result);
    });
});

//GET Participant by ID
router.get('/:id', function(req, res, next){
    models.Participant.find({
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

//Create new participant entry
router.post('/', function(req, res, next){
    models.Participant.create({
        name: req.body.name
    }).then(function(result){
        //Return Response
        res.json({
            "status": 201,
            "resource": result,
            "resourceLink": "/participants/"+result.id
        });
    });
});

//UPDATE annotation startime
router.post('/:id/updateStartTime', function(req, res, next){
    console.log('Updating participant');
    models.Participant.update({
        start_timespan: Date.now()
    }, {
        where: {
            id: req.params.id
        }
    }).then(function(updated){
        console.log("Participant updated", updated);
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

//UPDATE annotation endTime
router.post('/:id/updateEndTime', function(req, res, next){
    models.Participant.update({
        end_timespan: Date.now()
    }, {
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

//DELETE Participant
router.delete('/:id', function(req, res, next){
    models.Participant.destroy({
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

//GET Annotations by Participant 
router.get('/:id/annotations', function(req, res, next){
    models.Participant.find({
        where: {
            id: req.params.id
        },
        include: [models.Annotation]
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

module.exports = router;
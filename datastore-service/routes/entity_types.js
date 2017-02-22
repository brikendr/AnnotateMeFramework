var express     = require('express');
var router      = express.Router();
var models      = require('../models');

//GET all EntityType entries 
router.get('/', function(req, res, next) {
    models.EntityType.findAll().then(function(result){
        res.json(result);
    });
});

//GET EntityType by id 
router.get('/:id', function(req, res, next){
    models.EntityType.find({
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

//CREATE new EntityType 
router.post('/', function(req, res, next){
    models.EntityType.create({
        entity_type: req.body.entityType
    }).then(function(result){
        //Return Response
        res.json({
            "status": 201,
            "resource": result,
            "resourceLink": "/entitytypes/"+result.id
        });
    });
});

//UPDATE EntityType 
router.put('/:id', function(req, res, next){
    models.EntityType.update({
        entity_type: req.body.entityType
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

//DELETE EntityType 
router.delete('/:id', function(req, res, next){
    models.EntityType.destroy({
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
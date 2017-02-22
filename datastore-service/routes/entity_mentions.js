var express     = require('express');
var router      = express.Router();
var models      = require('../models');

//GET ALL Annotations
router.get('/', function(req, res, next){
    models.EntityMention.findAll().then(function(result){
        res.json(result);
    });
});

//GET entity mention by ID 
router.get('/:id', function(req, res, next) {
    models.EntityMention.find({
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

//CREATE an EntityMention 
router.post('/', function(req, res, next){
    models.EntityMention.create({
        description: req.body.entity,
        start_index: req.body.startIndex,
        end_index: req.body.endIndex,
        is_resolved: req.body.isResolved,
        is_coreferent: req.body.isCoreferent,
        coreferent_entity_id: req.body.coreferentID,
        ambiguity_threshold: req.body.threshold,
        DocumentId: req.body.documentId,
        EntityTypeId: req.body.typeId,
        SentanceId: req.body.sentanceId
    }).then(function(result){
        //Return Response
        res.json({
            "status": 201,
            "resource": result,
            "resourceLink": "/entities/"+result.id
        });
    });
});

//UPDATE an EntityMention
router.put('/:id', function(req, res, next){
    models.EntityMention.update({
        description: req.body.entity,
        start_index: req.body.startIndex,
        end_index: req.body.endIndex,
        is_resolved: req.body.isResolved,
        is_coreferent: req.body.isCoreferent,
        coreferent_entity_id: req.body.coreferentID,
        ambiguity_threshold: req.body.threshold,
        DocumentId: req.body.documentId,
        EntityTypeId: req.body.typeId,
        SentanceId: req.body.sentanceId
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

//Resolve EntityMention
router.put('/:id/resolve', function(req, res, next){
    models.EntityMention.update({
        is_resolved: true,
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


//UPDATE Ambiguity Threshhold
router.put('/:id/threshold', function(req, res, next){
    models.EntityMention.update({
        ambiguity_threshold: req.body.threshold,
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


//SET EntityMention as coreferente surface form 
router.put('/:id/coreferent', function(req, res, next){
    models.EntityMention.update({
        is_coreferent: true,
        coreferent_entity_id: req.body.coreferentID,
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


//DELETE EntityMention
router.delete('/:id', function(req, res, next){
    models.EntityMention.destroy({
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


//=========================== COLLOCATION ROUTES /:id/collocations =========================//

//GET Collocations 
router.get('/:id/collocations', function(req, res, next) {
    models.EntityMention.find({
        attributes: ['id', 'description'],
        where: {
            id: req.params.id
        },
        include: [models.Collocation]
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

//CREATE/UPDATE Collocation 
router.post('/:id/collocations', function(req, res, next){
    models.Collocation.find({
        where: {
            EntityMentionId: req.params.id
        }
    }).then(function(result){
        if(!result){
            //CREATE NEW collocation
            models.Collocation.create({
                collocation_json: req.body.collocationTokens,
                pos_json: req.body.collocationPOS,
                EntityMentionId: req.params.id
            }).then(function(result){
                //Return Response
                res.json({
                    "status": 201,
                    "resource": result,
                    "resourceLink": "/entities/"+result.EntityMentionId+"/collocations"
                });
            });
        } else {
            //UPDATE Existing
            models.Collocation.update({
                collocation_json: req.body.collocationTokens,
                pos_json: req.body.collocationPOS,
            }, {
                where: {
                    id: result.id
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
        }
    });
    
});


//DELETE Collocation 
router.delete('/:id/collocations', function(req, res, next){
    models.Collocation.destroy({
        where: { EntityMentionId: req.params.id }
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

//======================================= END ========================================//


//=========================== CADIDATE ROUTES /:id/candidates =========================//

//GET Candidates of EntityMention
router.get('/:id/candidates', function(req, res, next) {
    models.EntityMention.find({
        attributes: ['id', 'description', 'is_resolved'],
        where: {
            id: req.params.id
        },
        include: [models.Candidate]
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

//CREATE Candidate for EntityMention
router.post('/:id/candidates', function(req, res, next){
    models.EntityType.find({
        where: {
            entity_type: req.body.entityType
        }
    }).then(function(result){
        if(!result){
            res.json({
                "status": 404,
                "errorMsg": "EntityType ["+req.body.entityType+"] was not found!"
            });
        } else {
            console.log('Score is: '+req.body.score);
            var v1score = parseFloat(req.body.score);
            console.log('float value '+v1score);
            models.Candidate.create({
                candidate_name: req.body.candidateName,
                description: req.body.description,
                schema_type: req.body.schemaType,
                dbpediaURL: req.body.resourceURL,
                score: req.body.score,
                rank: req.body.rank,
                total_rank: req.body.totalRank,
                EntityMentionId: req.params.id,
                EntityType: result.id
            }).then(function(result){
                //Return Response
                res.json({
                    "status": 201,
                    "resource": result,
                    "resourceLink": "/entities/"+result.EntityMentionId+"/candidates"
                });
            });
        }
    });
});

//DELETE Candidates 
router.delete('/:id/candidates/:candidateID?', function(req, res, next){
    var whereClause = {};
    if(req.params.candidateID) {
        whereClause = {where: { id: req.params.candidateID }};
    } else {
        whereClause = {where: { EntityMentionId: req.params.id }};
    }
    
    models.Candidate.destroy(whereClause).then(function(deleted){
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

//======================================= END ========================================//



//GET Annotations 
router.get('/:id/annotations', function(req, res, next) {
    models.EntityMention.find({
        attributes: ['id', 'description', 'is_resolved'],
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
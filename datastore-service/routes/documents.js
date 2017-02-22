var express     = require('express');
var router      = express.Router();
var models      = require('../models');

//GET all documents
router.get('/', function(req, res, next) {
    models.Document.findAll().then(function(documents){
        res.json(documents);
    });
});

//Get document by id
router.get('/:id', function(req, res, next){
    models.Document.find({
        where: {
            id: req.params.id
        }
    }).then(function(document){
        if(!document){
            res.json({
                "status": 404,
                "errorMsg": "Resource not found!"
            });
        }

        res.json({
            "status": 200,
            "resource": document
        });
    });
});

//Create new document entry
router.post('/', function(req, res, next){
    models.Document.create({
        path:  req.body.path,
        dataset: req.body.dataset,
        length_index: req.body.lengthIdx,
        nr_characters: req.body.numCharacter
    }).then(function(document){
        //Return Response
        res.json({
            "status": 201,
            "resource": document,
            "resourceLink": "/docs/"+document.id
        });
    });
});

//Update Document information
router.put('/:id', function(req, res, next){
    models.Document.update({
        total_entries: req.body.totalEntries,
        total_linked_entities: req.body.totalLinked,
        total_nil_entities: req.body.totalNil,
        total_non_entities: req.body.totalNonEntities,
        is_resolved: req.body.isResolved
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

//DELETE document 
router.delete('/:id', function(req, res, next){
    models.Document.destroy({
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

//Resolve document route 
router.put('/:id/resolve', function(req, res, next){
    models.Document.update({
        is_resolved: true
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




//=========================== KEYWORD ROUTES  /:id/keywords =========================//

//GET Document Keywords 
router.get('/:id/keywords', function(req, res, next){
    models.Document.find({
        attributes: ['id', 'path', 'dataset', 'is_resolved'],
        where: {
            id: req.params.id
        },
        include: [models.Keyword]
    }).then(function(result){
        if(!result){
            res.json({
                "status": 404,
                "errorMsg": "Resource not found!"
            });
        }

        res.json({
            "status": 200,
            "resource": result,
            "resourceLink": "/docs/"+result.id
        });
    });
});

//CREATE Document Keyword 
router.post('/:id/keywords/', function(req, res, next){
    models.Keyword.create({
        keyword:  req.body.keyword,
        DocumentId: req.params.id
    }).then(function(result){
        //Return Response
        res.json({
            "status": 201,
            "resource": result,
            "resourceLink": "/docs/"+result.DocumentId+"/keywords"
        });
    });
});

//DELETE Document Keyword(s)
router.delete('/:id/keywords/:keywordID?', function(req, res, next){
    var whereClause = {};
    if(req.params.keywordID) {
        whereClause = {where: { id: req.params.keywordID }};
    } else {
        whereClause = {where: { DocumentId: req.params.id }};
    }
    
    models.Keyword.destroy(whereClause).then(function(deleted){
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
//================================= END ==============================================//



//=========================== SENTANCE ROUTES /:id/sentances =========================//

//GET Document Sentances
router.get('/:id/sentances', function(req, res, next){
    models.Document.find({
        attributes: ['id', 'path', 'dataset', 'is_resolved'],
        where: {
            id: req.params.id
        },
        include: [models.Sentance]
    }).then(function(result){
        if(!result){
            res.json({
                "status": 404,
                "errorMsg": "Resource not found!"
            });
        }

        res.json({
            "status": 200,
            "resource": result,
            "resourceLink": "/docs/"+result.id
        });
    });
});

//GET Document Sentance by ID 
router.get('/:id/sentances/:sentanceID', function(req, res, next){
    models.Sentance.find({
        where: {
            id: req.params.sentanceID
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
            "resource": result,
            "parentLink": "/docs/"+result.DocumentId
        });
    });
});

//CREATE Document Sentance
router.post('/:id/sentances/', function(req, res, next){
    models.Sentance.create({
        description: req.body.sentance,
        start_index: req.body.startIndex,
        end_index: req.body.endIndex,
        tokens: req.body.tokens,
        DocumentId: req.params.id
    }).then(function(result){
        //Return Response
        res.json({
            "status": 201,
            "resource": result,
            "resourceLink": "/docs/"+result.DocumentId+"/sentances/"+result.id
        });
    });
});

//UPDATE Document Sentance 
router.put('/:id/sentances/:sentanceID', function(req, res, next){
    models.Sentance.update({
        description: req.body.sentance,
        start_index: req.body.startIndex,
        end_index: req.body.endIndex,
        tokens: req.body.tokens,
    }, {
        where: {
            id: req.params.sentanceID
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

//DELETE Document Sentance(s)
router.delete('/:id/sentances/:sentanceID?', function(req, res, next){
    var whereClause = {};
    if(req.params.sentanceID) {
        whereClause = {where: { id: req.params.sentanceID }};
    } else {
        whereClause = {where: { DocumentId: req.params.id }};
    }
    
    models.Sentance.destroy(whereClause).then(function(deleted){
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

//GET Sentance EntityMentions
router.get('/:id/sentances/:sentanceID/entities', function(req, res, next){
    models.Sentance.find({
        where: {
            id: req.params.sentanceID
        },
        include: [models.EntityMention]
    }).then(function(result){
        if(!result){
            res.json({
                "status": 404,
                "errorMsg": "Resource not found!"
            });
        }

        res.json({
            "status": 200,
            "resource": result,
            "parentLink": "/docs/"+result.DocumentId
        });
    });
});


//======================================= END ========================================//


//GET ALL Documents' EntityMentions
router.get('/:id/entities', function(req, res, next){
    models.Document.find({
        attributes: ['id', 'path', 'dataset', 'is_resolved'],
        where: {
            id: req.params.id
        },
        include: [models.EntityMention]
    }).then(function(document){
        if(!document){
            res.json({
                "status": 404,
                "errorMsg": "Resource not found!"
            });
        }

        res.json({
            "status": 200,
            "resource": document
        });
    });
});

module.exports = router;
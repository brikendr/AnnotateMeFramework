var router      = require('express').Router();  
var models      = require('@brikendr/sequelize-models-annotateme/models');
var annotateMeAPIController = require('../controllers/annotateme_api');

//GET Method that prepares the necessary information from the db for the AnnotatMe Task!
router.post('/getTaskData', function(req, res, next) {
    console.log('POST REQUREST');
    annotateMeAPIController.prepareTaskData(req.body, function(taskData){
        res.json({
            'status': 200,
            'msg': 'Task Data Fetched',
            'resource': taskData
        });
    });
});

router.post('/getNILEntity', function(req, res, next){
    console.log("post:GETNilENTITY");
    annotateMeAPIController.prepareNILEntity(req.body, function(taskData){
        res.json({
            'status': 200,
            'msg': 'Task Data Fetched',
            'resource': taskData
        });
    });
})

module.exports = router;
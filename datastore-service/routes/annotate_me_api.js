var router      = require('express').Router();  
var models      = require('../models');
var controller  = require('../controllers/annotate_me_api');

/* NOTE: This is a READONLY API */


router.get('/', function(req, res, next) {
    models.Document.findAll().then(function(documents){
        res.json(documents);
    });
});

module.exports = router;
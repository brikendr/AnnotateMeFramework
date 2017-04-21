var router      = require('express').Router();  
var models      = require('@brikendr/sequelize-models-annotateme/models');
var gamecontroller_api = require('../controllers/gamecontroller_api');

//GET Method that prepares the necessary information from the db for the AnnotatMe Task!
router.post('/getGameRoundData', function(req, res, next) {
    console.log('GAME GET DATA REQUEST');
    gamecontroller_api.prepareGameData(req.body, function(game_data){
        res.json({
            'status': 200,
            'msg': 'GameRound Data Fetched',
            'resource': game_data
        });
    });
});

module.exports = router
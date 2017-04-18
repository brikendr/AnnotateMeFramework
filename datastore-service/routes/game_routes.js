var express     = require('express');
var router      = express.Router();
var models      = require('@brikendr/sequelize-models-annotateme/models'),
    gameController = require('../controllers/game_controller');

//Authenticate Player 
router.post('/authenticate', function(req, res, next) {
    var username = req.body.username,
        password = req.body.password;
    
    models.Player.find({
        where: {
            username: username,
            password: password,
            isactive: 1
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

//Register Player
router.post('/register', function(req, res, next) {
    var username = req.body.username,
        password = req.body.password,
        points   = req.body.points,
        playerWpm = req.body.wpm;
    
    //check if the player exists
    models.Player.find({
        where: {
            username: username,
            isactive: true
        }
    }).then(function(result){
        if(result != null){
            res.json({
                "status": 403,
                "errorMsg": "Username is taken!"
            });
        } else {
            //Register new player
            models.Player.create({
                username: username,
                password: password,
                points: points,
                LevelId: 1
            }).then(function(result){
                var PlayerData = result;

                //Register Player Initial Stats 
                models.Playerstats.create({
                    current_wps: playerWpm,
                    PlayerId: PlayerData.id
                }).then(function(stats){

                    //Return Response
                    res.json({
                        "status": 200,
                        "resource": PlayerData
                    });
                });
            });
        }
    });

});

router.get('/categories', function(req, res, next){
    models.Category.findAll({
        where: {
            isactive: 1
        }
    }).then(function(result){
        res.json({
            "status": 200,
            "resource": result
        });
    });
});

router.get('/playerStats/:id',function(req, res, next){
    var playerID = req.params.id;
    models.Playerstats.find({
        where: {
            PlayerId: playerID
        },
        include: [models.Player]
    }).then(function(playerStatistics) {
        playerStatistics.Player.getLevel();

        //getLevel OBJ
        models.Level.find({
            where: {
                id: playerStatistics.Player.LevelId
            }
        }).then(function(levelObj){
            res.json({
                "status": 200,
                "resource": {
                    'stats': playerStatistics,
                    'level': levelObj
                }
            });
        })
        
    });
});

router.post('/score/:id', function(req, res, next){
    var playerID = req.params.id,
        newPoints = req.body.point;

    //Set New Point 
    models.Player.update({
            points: newPoints
        }, {
            where: {
                id: playerID
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

router.post('/wpm/:id', function(req, res, next){
    var playerID = req.params.id,
        newWpm = req.body.wpm;

    //Update new WPM
    models.Playerstats.update({
        current_wps: newWpm
    }, {
        where: {
            PlayerId: playerID
        }
    }).then(function(updated){
        //Register to PlayerPerformanceHistory
        gameController.createNewPerformanceHistory(playerID,1,newWpm);
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

router.post('/level/:id/levelUpPlayer', function(req, res, next){
    var playerID = req.params.id,
        player = req.body.player,
        currentLevel = req.body.currentLevel;
        
    //Get Next Level
    models.Level.find({
        where: {
            id: currentLevel.id + 1
        }
    }).then(function(nextLevel){
        if(nextLevel != null) {
            console.log("NEW LEVEL IS ", nextLevel.name);
            if(player.points >= nextLevel.lower_limit) {
                //Update player Level 
                console.log('UPGRADE');
                models.Player.update({
                    LevelId: nextLevel.id
                }, {
                    where: {
                        id: playerID
                    }
                }).then(function(updatedLevel){
                    res.json({
                        "status": 200,
                        "resource": {
                            'updated': true,
                            'status': 'upgrade',
                            'newLevel': nextLevel
                        }
                    });
                });
            } else if (player.points < currentLevel.lower_limit && currentLevel.id > 1) {
                //player has leveld down, and was on a level greater than the first level
                console.log('DOWNGRADE TO ', currentLevel.id - 1);
                models.Player.update({
                    LevelId: currentLevel.id - 1
                }, {
                    where: {
                        id: playerID
                    }
                }).then(function(updatedPlayerLevel){
                    //Find Level Obj
                    models.Level.find({
                        where: {
                            id: currentLevel.id - 1
                        }
                    }).then(function(downgradedLevel){
                        res.json({
                            "status": 200,
                            "resource": {
                                'updated': true,
                                'status': 'downgrade',
                                'newLevel': nextLevel
                            }
                        });
                    });
                });
            } else {
                res.json({
                    "status": 200,
                    "resource": {
                        'updated': false
                    }
                });
            }
        } else {
            res.json({
                "status": 200,
                "resource": {
                    'updated': false
                }
            });
        }
    });
});

router.post('/addGameRound', function(req, res, next) {
    var gameData = req.body.gameData;
    
    models.Game.create({
        wps: gameData.wps,
        typing_paragraph: gameData.typing_paragraph,
        betscore: gameData.betscore,
        isBetValidated: false,
        EntityMentionId: gameData.EntityMentionId,
        CandidateId: gameData.CandidateId,
        PlayerId: gameData.PlayerId
    }).then(function(result){
        //Check if entity has acquired 4 annotatation for the same candidate
        gameController.triggerEntityResolution(gameData.EntityMentionId);
        //Return Response
        res.json({
            "status": 200,
            "resource": result
        });
    })
});
module.exports = router;
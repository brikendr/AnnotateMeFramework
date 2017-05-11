var express     = require('express');
var router      = express.Router();
var models      = require('@brikendr/sequelize-models-annotateme/models'),
    gameController = require('../controllers/game_controller'),
    moment      = require('moment'),
    passwordHash = require('password-hash');

//Authenticate Player 
router.post('/authenticate', function(req, res, next) {
    var username = req.body.username,
        password = req.body.password;
    
    models.Player.find({
        where: {
            username: username,
            isactive: 1
        }
    }).then(function(result){
        if(!result){
            res.json({
                "status": 404,
                "errorMsg": "Resource not found!"
            });
        }
        console.log("VERYFYING ", result.password);
        if(passwordHash.verify(password, result.password)) {
            res.json({
                "status": 200,
                "resource": result
            });
        } else {
            res.json({
                "status": 404,
                "errorMsg": "Resource not found!"
            });
        }
        
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

router.get('/categories/:id', function(req, res, next){
    //Use Controller 
    //1. Get Total entity mentions by category 
    //2. Get Entity mentions resolved by category 
    //3. Progress is Resolved / total 
    //4. Append Progress in the total List
    //5. Return Object
    gameController.getCategoriesWithStats(req.params.id,function(categories){
        res.json({
            "status": 200,
            "resource": categories
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
    
    var createdAt = moment(gameData.gameRoundStart).format("YYYY-MM-DD h:mm:ss");
        //updatedAt = moment(gameData.gameRoundEnd).format("YYYY-MM-DD h:mm:ss");
        
    models.Game.create({
        wps: gameData.wps,
        typing_paragraph: gameData.typing_paragraph,
        betscore: gameData.betscore,
        isBetValidated: false,
        EntityMentionId: gameData.EntityMentionId,
        CandidateId: gameData.CandidateId,
        PlayerId: gameData.PlayerId,
        createdAt: createdAt
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

//FOR EXPERIMENT PURPOSE ONLY 
router.post('/updateGameFinishTime', function(req, res, next){
    var gameId      = req.body.gameId,
        updatedAt   = moment(req.body.finishTime).format("YYYY-MM-DD h:mm:ss");
    console.log("UPDATING FINISH ROUND");
    models.Game.update({
        updatedAt: updatedAt
    },{
        where: {
            id: gameId
        }
    });
})

router.get('/getPossibleChallengers/wpm/:wpm/player/:id', function(req, res, next) {
    var playerID = req.params.id,
        wpm = req.params.wpm;

    //TODO: SELECT AVG WPMs
    models.Playerstats.findAll({
        where: {
            PlayerId: {$ne: playerID},
            current_wps: {$between: [wpm - 10, wpm + 10]}
        },
        include: [models.Player],
        order: [['current_wps', 'DESC']],
        limit: 5
    }).then(function(result){
        res.json({
            "status": 200,
            "resource": result
        });
    });
});

router.post('/challengePlayers', function(req, res, next) {
    gameController.createChallenges(req.body.data, function(challenges){
        //Return Response
        res.json({
            "status": 200,
            "resource": challenges
        });
    });
});

router.get('/getPlayerChallenges/:id', function(req, res, next){
    var playerID = req.params.id;

    models.Challenge.findAll({
        where: {
            challengeeId: playerID,
            status: 0
        },
        include: [{model: models.Player, as: 'challenger'}]
    }).then(function(result){
        //Return Response
        res.json({
            "status": 200,
            "resource": result
        });
    })
});

router.get("/getChallengeInfo/:challengeId", function(req, res, next) {
    var challengeId = req.params.challengeId;

    models.Challenge.find({
        where: {
            id: challengeId
        },
        include: [models.Game, {model: models.Player, as: 'challenger'},{model: models.Player, as: 'challengee'}]
    }).then(function(challenge){
        //Return Response
        res.json({
            "status": 200,
            "resource": challenge
        });
    });
});

router.post('/updateChallenge', function(req, res, next){
    var data = req.body.data;
    
    models.Challenge.update({
        status: data.status
    }, {
        where: {
            id: data.challengeId
        }
    }).then(function(result){
        if(data.shouldUpdatePlayerScore && data.challengerId != 1) {//Do not update points if its the bot [aka id=1]
            //Set New Point 
            models.Player.update({
                points: data.newPoints
            }, {
                where: {
                    id: data.challengerId
                }
            }).then(function(updated){
                //Return Response
                res.json({
                    "status": 200,
                    "resource": updated
                });
            });
        } else {
            //Return Response
            res.json({
                "status": 200,
                "resource": result
            });
        }
        
    });
});

router.get('/getProfileStats/:id', function(req,res,next){
    var PlayerId = req.params.id;
    gameController.getProfileStats(PlayerId, function(data){
        res.json({
            "status": 200,
            "resource": data
        });
    });
});

router.get('/getUpdatedChallenges/:id', function(req, res, next){
    var PlayerId = req.params.id;

    models.Challenge.findAll({
        where: {
            challengerId: PlayerId,
            status: {$in: [1, 2, 3]}
        },
        include: [{model: models.Player, as: 'challengee'}]
    }).then(function(result){
        res.json({
            "status": 200,
            "resource": result
        });
    })
});

router.get('/getLeaderBoard', function(req, res, next){
    models.Player.findAll({
        order: 'current_wps DESC',
        include: [models.Playerstats, models.Level]
    }).then(function(leaderboard){
        res.json({
            "status": 200,
            "resource": leaderboard
        });
    });
});

router.get("/botChallengePlayer/:id", function(req, res, next){
    var playerId = req.params.id;
    //Check if player has played one game round 
    models.Game.count({ where: { PlayerId: playerId} }).then(function(totalGames) {
        var shouldBotChallengePlayer = false;
        if(totalGames == 1) {
            //check if player has already completed the challenge with bot 
            models.Challenge.count({where: {challengerId: 1, challengeeId: playerId, status: {$gt: 0}}}).then(function(challengeCount){
                if(challengeCount == 0) {
                    //Create a challenge 
                    models.Challenge.create({
                        p1_wps: 20, //bot id
                        p2_wps: 40,
                        status: 0,
                        challenged_points: 10,
                        challengerId: 1, //bot id
                        challengeeId: playerId,
                        GameId: 1,
                    });
                    shouldBotChallengePlayer = true;
                }
                res.json({
                    "status": 200,
                    "resource": {
                        'shouldBotChallenge': shouldBotChallengePlayer
                    }
                });
            });
        } else {
            res.json({
                "status": 200,
                "resource": {
                    'shouldBotChallenge': shouldBotChallengePlayer
                }
            });
        }
        
    });
});

router.get('/getPlayerPositionInLeaderboard/:id', function(req, res, next){
    var playerId = req.params.id;

    models.Player.findAll({
        order: 'current_wps DESC',
        include: [models.Playerstats],
        limit: 15
    }).then(function(leaderboard){
        var playerPosInLeaderboard = -1;
        for(var i=0; i<leaderboard.length; i++) {
            if(leaderboard[i].id == playerId) {
                //player is in top 15
                playerPosInLeaderboard = i+1; //since i starts from 0
            }
        }
        console.log('POSITION IS : ', playerPosInLeaderboard);
        res.json({
            "status": 200,
            "resource": {
                'position': playerPosInLeaderboard
            }
        });
    })
})

module.exports = router;
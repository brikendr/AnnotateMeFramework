var express     = require('express');
var router      = express.Router();
var models      = require('@brikendr/sequelize-models-annotateme/models');

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
        password = req.body.password;

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
            models.Player.create({
                username: username,
                password: password,
                LevelId: 1
            }).then(function(result){
                //Return Response
                res.json({
                    "status": 200,
                    "resource": result
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
})
module.exports = router;
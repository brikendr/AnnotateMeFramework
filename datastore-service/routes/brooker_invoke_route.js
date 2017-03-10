var express     = require('express');
var router      = express.Router();
var sendbrooker = require('../message_brookers/send_message');

router.post('/', function(req, res, next){
    console.log('Invoing Brooker');
    sendbrooker.publishMessage(req.body, function(resolved){
        res.json({
            'status': 200,
            'msg': 'Document Data Generated Sucessfully!'
        });
    });
});


module.exports = router;

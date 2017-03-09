var express     = require('express');
var router      = express.Router();


router.post('/', function(req, res, next){
    console.log('Invoing Brooker');
    require('../message_brookers/send_message').publishMessage(req.body);
        console.log('FINISHED');
        res.json({
            'status': 200,
            'msg': 'Brooker Invoked!'
        });
});


module.exports = router;

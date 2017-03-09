var amqp = require('amqp');


exports.publishMessage = function(data){
    console.log('Calling GET EXCHANGE!');
    var connection = amqp.createConnection({ host: process.env.RABBITMQ_HOST });
    connection.on('ready', function(){
        console.log('Connection Established! Ready to Emit');
        connection.exchange('Datastore', {type: 'topic', 'durable': false}, function(exchange) {
            
            console.log('Publishing DATA');
            exchange.publish(
                'create.document.data', 
                { 
                    "path": data.path, 
                    'content': data.text, 
                    'dataset': data.dataset,
                    'confidence': data.confidence,
                    'support': data.support,
                    'nrKeywordsToExtract': data.keywords,
                    'nrConceptsToExtract': data.concepts,
                    'sentanceRestricted': data.sentanceRestrictered == 1 ? true:false,
                    'routeKey': "createDocument"
                }, 
                {contetnType: 'applicaton/json'}
            );
            setTimeout(function () {
                console.log('Connection will be closed now!');
                // wait one second to receive the message, then quit
                connection = null;
            }, 2000);
        });
        
    });
    connection.on('error', function(e) {
        console.log("Error from amqp: ", e);
    });
    connection.on('end', function() {
        console.log('Connection ENDED!');
    });
}


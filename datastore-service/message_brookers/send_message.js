var amqp = require('amqp');


exports.publishMessage = function(data, callback){
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

            connection.queue('randomQueue', {exclusive: true}, function (q) {
                //Bind queue with the exchange
                q.bind(exchange, 'document.datageneration.done', function() {
                    console.log('ALL Services have been executed!')
                    q.subscribe(function (message) {
                        console.log('Distroying QUEUE');
                        q.destroy();
                        console.log('ENDING SOCKET');
                        connection.end();
                        console.log('DESTROYING SOCKET');
                        connection.destroy();
                        callback(true);
                    });
                });
                
            });
        });
        
    })     
    .on('error', function(e) {
        console.log("Error from amqp: ", e);
        callback(false);
    }).on('end', function() {
        console.log('Connection ENDED!');
        callback(true);
    });
    
}


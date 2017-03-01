var amqp        = require('amqp');
var entityExtractor = require('./../controllers/entity_extractor');

var connection = amqp.createConnection({ host: process.env.RABBITMQ_HOST });

// add this for better debuging
connection.on('error', function(e) {
  console.log("Error from amqp: ", e);
});

//Default exchange options, Type: Topic and Durable: False
console.log('NER-SERVICE: Connection Established! Ready To Recieve!');
connection.on('ready', function(){
    connection.exchange('Datastore', {type: 'topic', 'durable': false}, function(exchange) {
        console.log('Connected to Datastore Exchange.');

        connection.queue('entityExtractionQueue', {exclusive: true}, function (q) {
            console.log("QUEUE: "+q.name);
            
            //Bind entityExtractionQueue to listen about document extraction properties.
            q.bind(exchange, 'extract.document.*', function(){
                q.subscribe(function (message) {
                    console.log('Recieved a message for document extraction properties.');
                    // Call the algorithm that performs all the necessary steps for Named Entity Recognition 
                    entityExtractor.namedEntityExtractor(message,exchange, function(finalResult){ 
                        console.log('NER-SERVICE: Publishing create.document.entities message!');
                        //Publish message that for the datastor to associate entities with the document 
                        finalResult.routeKey = 'createEntities';
                        exchange.publish("create.document.entities", finalResult , {contetnType: 'applicaton/json'});
                    });
                });
            });
            
        });
    });
});
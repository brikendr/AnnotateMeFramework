var amqp        = require('amqp');
var contextClueExtractor = require('./../controllers/contextclue_extractor');

var connection = amqp.createConnection({ host: process.env.RABBITMQ_HOST });

// add this for better debuging
connection.on('error', function(e) {
  console.log("Error from amqp: ", e);
});

//Default exchange options, Type: Topic and Durable: False
console.log('CONTEXTCLUES-SERVICE: Connection Established! Ready To Recieve!');
connection.on('ready', function(){
    connection.exchange('Datastore', {type: 'topic', 'durable': false}, function(exchange) {
        console.log('Connected to Datastore Exchange.');

        connection.queue('entityContextClueExtractionQueue', {exclusive: true}, function (q) {
            console.log("QUEUE: "+q.name);
            
            //Bind entityExtractionQueue to listen about document extraction properties.
            q.bind(exchange, 'extract.entity.clues', function(){
                q.subscribe(function (message) {
                    console.log('Recieved a message for entity clue extraction.');
                    // Call method that extract context clues to each entity of the document 
                    contextClueExtractor.extractContextClues(message , function(entities){
                        console.log('CONTEXT CLUES HAVE BEEN EXTRACTED');
                        //Publish message that for the datastore to associate the collocations with the entities
                        var finalResult = {
                            'routeKey': 'createCollocations',
                            'entities': entities
                        }
                        exchange.publish("create.entity.clues", finalResult , {contetnType: 'applicaton/json'});
                    });
                });
            });
            
        });
    });
});
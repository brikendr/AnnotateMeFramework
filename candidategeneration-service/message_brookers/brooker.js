var amqp        = require('amqp');
var candidate_generator = require('./../controllers/candidate_generator');

var connection = amqp.createConnection({ host: process.env.RABBITMQ_HOST });

// add this for better debuging
connection.on('error', function(e) {
  console.log("Error from amqp: ", e);
});

//Default exchange options, Type: Topic and Durable: False
console.log('CANDIDATEGEN-SERVICE: Connection Established! Ready To Recieve!');
connection.on('ready', function(){
    connection.exchange('Datastore', {type: 'topic', 'durable': false}, function(exchange) {
        console.log('Connected to Datastore Exchange.');

        connection.queue('candidateGenerationQueue', {exclusive: true}, function (q) {
            console.log("QUEUE: "+q.name);
            
            //Bind entityExtractionQueue to listen about document extraction properties.
            q.bind(exchange, 'extract.entity.candidates', function(){
                q.subscribe(function (message) {
                    console.log('Recieved a message for entity candidate generation.');
                    // Call the algorithm that performs all the necessary steps for Named Entity Recognition 
                    candidate_generator.generateCandidateEntities(message, function(finalResult){ 
                        console.log('CANDIDATEGEN-SERVICE: Publishing create.entity.candidates message!');
                        //Publish message that for the datastor to associate entities with the document 
                        var dataToSend = {
                            'documentID' : message.documentID, 
                            'entities': finalResult,
                            'routeKey': 'createEntityCandidates'
                        };
                        exchange.publish("create.entity.candidates", dataToSend , {contetnType: 'applicaton/json'});
                    });
                });
            });
            
        });
    });
});
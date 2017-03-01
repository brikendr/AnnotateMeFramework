var amqp                = require('amqp');
var keywordExtractor    = require('./../controllers/keyword_extractor');

var connection = amqp.createConnection({ host: process.env.RABBITMQ_HOST });

// add this for better debuging
connection.on('error', function(e) {
  console.log("Error from amqp: ", e);
});

console.log('TOPIC-KEYWORD-SERVICE: Connection Established! Ready To Recieve!');
connection.on('ready', function(){
    connection.exchange('Datastore', {type: 'topic', 'durable': false}, function(exchange) {
        console.log('Connected to Datastore Exchange.');

        connection.queue('keywordExtractionQueue', {exclusive: true}, function (q) {
            console.log("QUEUE: "+q.name);
            
            //Bind entityExtractionQueue to listen about document extraction properties.
            q.bind(exchange, 'extract.document.*', function(){
                q.subscribe(function (message) {
                    console.log('Recieved a message for document keyword extraction.');
                    // Call the controller for extracting the keywords using Alchemy API
                    keywordExtractor.extractKeywords(message, function(keywords){
                        console.log('TOPIC-KEYWORD-SERVICE: Publishing create.document.keywords message!');
                        var finalResult = {
                            'routeKey'  : 'createKeywords',
                            'documentID': message.documentID,
                            'keywords'  : keywords
                        };
                        exchange.publish("create.document.keywords", finalResult , {contetnType: 'applicaton/json'});
                    });
                });
            });
            
        });
    });
});
var amqp        = require('amqp');
var docController  = require('../controllers/document_controller');
var entityController = require('../controllers/entity_controller');

var connection = amqp.createConnection({ host: process.env.RABBITMQ_HOST });

// add this for better debuging
connection.on('error', function(e) {
  console.log("Error from amqp: ", e);
});

//Default exchange options, Type: Topic and Durable: False
console.log('DATASTORE-SERVICE: Connection Established! Ready To Recieve!');
connection.on('ready', function(){
    connection.exchange('Datastore', {type: 'topic', 'durable': false}, function(exchange) {
        console.log('Connected to Datastore Exchange.');

        connection.queue('storingQueue', {exclusive: true}, function (q) {
            console.log("QUEUE: "+q.name);
            
            //Bind queue to recive everything related to rabbits, and everything lazy animals
            q.bind(exchange, 'create.document.*', function() {
                q.bind(exchange, 'create.entity.*', function() {
                    q.subscribe(function (message) {
                        console.log('Recieved a message! RouteKey = '+message.routeKey);

                        if(message.routeKey == 'createDocument') {
                            docController.createDocument(message, function(document) {
                                console.log('Document has been created!');
                                exchange.publish(
                                    "extract.document.entities&keywords", 
                                    {
                                        'documentID'            : document.id, 
                                        'textData'              : document.content,
                                        'confidence'            : message.confidence,
                                        'support'               : message.support,
                                        'nrKeywordsToExtract'   : message.nrKeywordsToExtract,
                                        'nrConceptsToExtract'   : message.nrConceptsToExtract
                                    },  
                                    {contetnType: 'applicaton/json'}
                                );
                            });
                        }
                        else if(message.routeKey == 'createEntities') {
                            console.log("RECEIVED a message for document entity creation!");
                            docController.persistEntities(message, function(persisted){
                                console.log('Entities and sentances have been persisted!');
                                console.log('Publishing message to extract context clues!');
                                docController.findSentancesByDocumentID(message, function(sentances){
                                    exchange.publish(
                                        "extract.entity.clues", 
                                        {
                                            'documentID'            : message.documentID, 
                                            'sentances'             : sentances,
                                            'sentanceRestricted'    : message.sentanceRestricted
                                        },  
                                        {contetnType: 'applicaton/json'}
                                    );
                                });
                            });
                        }
                        else if(message.routeKey == 'createKeywords') {
                            console.log("RECEIVED a message for document keyword creation!");
                            docController.persistKeywords(message, function(persisted){
                                if(!persisted) {console.log('Keywords not persisted! Something went wrong')}
                                else {console.log('Keywords have been persisted!');}
                            });
                        } else if (message.routeKey == 'createCollocations') {
                            console.log("RECEIVED a message for creating collocation for entities!");
                            entityController.createEntityCollocations(message, function(){
                                console.log('Collocations have been persisted');
                            });
                        }

                    });
                });
            });
        });
    });
});
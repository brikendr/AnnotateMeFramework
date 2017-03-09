var amqp = require('amqp');

var connection = amqp.createConnection({ host: '0.0.0.0', port: '32769' });
var exchange = null;


connection.on('error', function(e) {
  console.log("Error from amqp: ", e);
});

connection.on('ready', function(){
    console.log('Connection Established! Ready to Emit');
    connection.exchange('Datastore', {type: 'topic', 'durable': false}, function(exchange) {
      this.exchange = exchange;
  });
});

var Brooker = {
    publishMessage: function(data){
        exchange.publish(
        'create.document.data', 
        { 
          "path": data.path, 
          'content': data.content, 
          'dataset': data.dataset,
          'confidence': data.confidence,
          'support': data.support,
          'nrKeywordsToExtract': data.keyWordsToExtract,
          'nrConceptsToExtract': data.ConceptsToExtract,
          'sentanceRestricted': data.sentanceRestrictered,
          'routeKey': "createDocument"
        },
        {contetnType: 'applicaton/json'}
      );
      closeConnection();
    },
    closeConnection: function() {
        setTimeout(function () {
            // wait one second to receive the message, then quit
            connection.end();
        }, 1000);
    }
}

module.exports = Brooker;
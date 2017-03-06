/**
 * REST request class
 *
 * User: bryanmac
 * Date: 2/10/12
 */

var http = require("http");
var https = require("https");
var request = require('request');
var parser = require('xml2json');


/**
 * postRequestJSON: post a JSON object using the request library
 *
 * @param options
 * @param callback: callback to pass the results JSON object(s) back
 */
exports.postRequestJSON = function(options, onResult){
    var req = request.post(options, function(err,httpResponse,body){ 
        var candidates;
        try {
            candidates = JSON.parse(parser.toJson(body)).annotation.surfaceForm;
            onResult(httpResponse.statusCode, candidates);
        } catch (e) {
            console.log(e);
            onResult(null);
        }
    });
};

exports.getRequestJSON = function(options, onResult){
    var req = request.get(options, function(err,httpResponse,body){
        var candidateData;
        try {
            candidateData = JSON.parse(body).results[0];
            onResult(httpResponse.statusCode, candidateData);
        } catch (e) {
            console.log(e);
            onResult(null);
        }
        
    });
};
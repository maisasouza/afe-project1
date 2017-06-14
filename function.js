'use strict';

console.log('Loading function');

const doc = require('dynamodb-doc');
var AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();


/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    var param = {
        TableName: "musica"
    };

    switch (event.httpMethod) {
        case 'DELETE':
            dynamo.deleteItem(JSON.parse(event.body), done);
            break;
        case 'GET':
            var queryParams = event.queryStringParameters;
            if (queryParams !== null && queryParams !== undefined) {
                if (queryParams.autor !== null && queryParams.autor !== undefined) {
                    param.FilterExpression = "#nome = :autorParam";
                    param.ExpressionAttributeNames = {
                        "#nome": "autor"
                    };
                    param.ExpressionAttributeValues = {
                        ":autorParam": queryParams.autor
                    };
                } else if (queryParams.nome !== null && queryParams.nome !== undefined) {
                    param.FilterExpression = "#nome = :nomeParam";
                    param.ExpressionAttributeNames = {
                        "#nome": "nome"
                    };
                    param.ExpressionAttributeValues = {
                        ":nomeParam": queryParams.nome
                    };
                }
            }
            dynamo.scan(param, done);
            break;
        case 'POST':
            if (event.body !== null && event.body !== undefined) {
                /*param.Item = event.body;
                console.log('Param: ' + param);*/
                dynamo.put(event.body, done);
            }
            break;
        case 'PUT':

            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};
'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

module.exports = (event, callback) => {
  const data = JSON.parse(event.body);
  const nowDate = new Date().getTime();

  const clientCreateParams = {};

  clientCreateParams.id = uuid.v1();
  clientCreateParams.secret = uuid.v4();
  clientCreateParams.name = data.body.name;
  clientCreateParams.redirectUri = data.body.redirectUri;
  clientCreateParams.createdAt = nowDate;
  clientCreateParams.updatedAt = nowDate;

  const params = {
    TableName: 'Clients',
    Item: clientCreateParams
  };

  return dynamoDb.put(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(error, params.Item);
  });
};

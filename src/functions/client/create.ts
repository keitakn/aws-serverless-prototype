import * as AWS from 'aws-sdk';
import * as uuid from 'uuid';
import {LambdaExecutionContext} from '../../../types';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export default function(event, context: LambdaExecutionContext, callback) {
  const data = JSON.parse(event.body);
  const nowDate = new Date().getTime();

  const clientCreateParams = {
    id: uuid.v1(),
    secret: uuid.v4(),
    name: data.body.name,
    redirectUri: data.body.redirectUri,
    createdAt: nowDate,
    updatedAt: nowDate
  };

  const params = {
    TableName: 'Clients',
    Item: clientCreateParams
  };

  dynamoDb.put(params, (error: any, data: any) => {
    if (error) {
      callback(error);
      return;
    }

    const response = {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin" : "*"
      },
      body: JSON.stringify(data.Item),
    };

    callback(null, response);
  });
};

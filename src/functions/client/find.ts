import * as AWS from 'aws-sdk';
import {LambdaExecutionContext} from '../../../types';
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export default function(event, context: LambdaExecutionContext, callback) {
  const params: any = {
    TableName: 'Clients',
    Key: {
      id: event.pathParameters.id
    }
  };

  dynamoDb.scan(params, (error: any, data: any) => {
    if (error) {
      callback(error);
      return;
    }

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*"
      },
      body: JSON.stringify(data.Item),
    };

    callback(null, response);
  });
};

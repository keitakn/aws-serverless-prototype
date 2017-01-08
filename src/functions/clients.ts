import * as sourceMapSupport from "source-map-support";
import * as lambda from "aws-lambda";
import * as AWS from "aws-sdk";
import * as uuid from "uuid";
import {LambdaExecutionEvent} from "../../types";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

sourceMapSupport.install();

export const create = (event: LambdaExecutionEvent, context: lambda.Context, callback: lambda.Callback): void => {
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
    TableName: "Clients",
    Item: clientCreateParams
  };

  dynamoDb.put(params, (error: any) => {
    if (error) {
      callback(error);
    }

    const response = {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin" : "*"
      },
      body: JSON.stringify(clientCreateParams),
    };

    callback(null, response);
  });
};

export const find = (event: LambdaExecutionEvent, context: lambda.Context, callback: lambda.Callback): void => {
  const params = {
    TableName: "Clients",
    Key: {
      id: event.pathParameters.id
    }
  };

  dynamoDb.get(params, (error: any, data: any) => {
    if (error) {
      callback(error);
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


import * as sourceMapSupport from "source-map-support";
import * as lambda from "aws-lambda"
import * as AWS from "aws-sdk";
import {LambdaExecutionEvent} from "../../../types";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

sourceMapSupport.install();

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

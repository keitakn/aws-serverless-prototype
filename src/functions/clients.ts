import * as sourceMapSupport from "source-map-support";
import * as lambda from "aws-lambda";
import * as AWS from "aws-sdk";
import * as uuid from "uuid";
import {LambdaExecutionEvent} from "../../types";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

sourceMapSupport.install();

/**
 * クライアントを作成する
 *
 * @param event
 * @param context
 * @param callback
 */
export const create = (event: LambdaExecutionEvent, context: lambda.Context, callback: lambda.Callback): void => {
  const requestBody = JSON.parse(event.body);
  const nowDate = new Date().getTime();

  const clientCreateParams = {
    id: uuid.v1(),
    secret: uuid.v4(),
    name: requestBody.name,
    redirect_uri: requestBody.redirect_uri,
    created_at: nowDate,
    updated_at: nowDate
  };

  const putParam = {
    TableName: "Clients",
    Item: clientCreateParams
  };

  dynamoDb.put(putParam, (error: any) => {
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

/**
 * クライアントを1件取得する
 *
 * @param event
 * @param context
 * @param callback
 */
export const find = (event: LambdaExecutionEvent, context: lambda.Context, callback: lambda.Callback): void => {
  const getParam = {
    TableName: "Clients",
    Key: {
      id: event.pathParameters.id
    }
  };

  dynamoDb.get(getParam, (error: any, data: any) => {
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


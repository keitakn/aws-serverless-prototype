import * as sourceMapSupport from "source-map-support";
import * as lambda from "aws-lambda";
import * as AWS from "aws-sdk";
import * as uuid from "uuid";
import {LambdaExecutionEvent} from "../../types";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

sourceMapSupport.install();

/**
 * ユーザーを作成する
 *
 * @param event
 * @param context
 * @param callback
 */
export const create = (event: LambdaExecutionEvent, context: lambda.Context, callback: lambda.Callback): void => {
  const requestBody = JSON.parse(event.body);
  const nowDate = new Date().getTime();

  const userCreateParams = {
    id: uuid.v4(),
    email: requestBody.email,
    email_verified: 0,
    name: requestBody.name,
    gender: requestBody.gender,
    birthdate: requestBody.birthdate,
    created_at: nowDate,
    updated_at: nowDate
  };

  const putParam = {
    TableName: "Users",
    Item: userCreateParams
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
      body: JSON.stringify(userCreateParams)
    };

    callback(null, response);
  });
};

/**
 * ユーザーを1件取得する
 *
 * @param event
 * @param context
 * @param callback
 */
export const find = (event: LambdaExecutionEvent, context: lambda.Context, callback: lambda.Callback): void => {
  const getParam = {
    TableName: "Users",
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

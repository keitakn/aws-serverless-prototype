import * as sourceMapSupport from "source-map-support";
import * as lambda from "aws-lambda";
import * as uuid from "uuid";
import {LambdaExecutionEvent} from "../../types";
import UserEntity from "../domain/user/user-entity";
import ErrorResponse from "../domain/error-response";
import AwsSdkFactory from "../factories/aws-sdk-factory";
import UserRepository from "../repositories/user-repository";
import Environment from "../infrastructures/Environment";

sourceMapSupport.install();

let dynamoDbDocumentClient = AwsSdkFactory.getInstance().createDynamoDbDocumentClient();

/**
 * ユーザーを作成する
 *
 * @param event
 * @param context
 * @param callback
 */
export const create = (event: LambdaExecutionEvent, context: lambda.Context, callback: lambda.Callback): void => {
  // TODO このあたりの処理はリクエストオブジェクトに集約する @keita-nishimoto
  const environment = new Environment(event);

  let requestBody;
  if (environment.isLocal() === true) {
    requestBody = event.body;
  } else {
    requestBody = JSON.parse(event.body);
  }

  const nowDateTime = new Date().getTime();

  const userEntity = new UserEntity(uuid.v4(), nowDateTime);
  userEntity.email = requestBody.email;
  userEntity.emailVerified = 0;
  userEntity.name = requestBody.name;
  userEntity.gender = requestBody.gender;
  userEntity.birthdate = requestBody.birthdate;
  userEntity.updatedAt = nowDateTime;

  if (environment.isLocal() === true) {
    dynamoDbDocumentClient = AwsSdkFactory.getInstance().createDynamoDbDocumentClient(
      environment.isLocal()
    );
  }

  const userRepository = new UserRepository(dynamoDbDocumentClient);
  userRepository.save(userEntity)
    .then((userEntity) => {

      const responseBody = {
        id: userEntity.id,
        email: userEntity.email,
        email_verified: userEntity.emailVerified,
        name: userEntity.name,
        gender: userEntity.gender,
        birthdate: userEntity.birthdate,
        created_at: userEntity.createdAt,
        updated_at: userEntity.updatedAt
      };

      const response = {
        statusCode: 201,
        headers: {
          "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify(responseBody)
      };

      callback(null, response);
    })
    .catch((error) => {
      console.error("createUserError", error);
      callback(error);
    });
};

/**
 * ユーザーを取得する
 *
 * @param event
 * @param context
 * @param callback
 */
export const find = (event: LambdaExecutionEvent, context: lambda.Context, callback: lambda.Callback): void => {
  // TODO このあたりの処理はリクエストオブジェクトに集約する @keita-nishimoto
  const userId = event.pathParameters.id;
  const environment = new Environment(event);
  if (environment.isLocal() === true) {
    dynamoDbDocumentClient = AwsSdkFactory.getInstance().createDynamoDbDocumentClient(
      environment.isLocal()
    );
  }

  const userRepository = new UserRepository(dynamoDbDocumentClient);
  userRepository.find(userId)
    .then((userEntity) => {
      const responseBody = {
        id: userEntity.id,
        email: userEntity.email,
        email_verified: userEntity.emailVerified,
        name: userEntity.name,
        gender: userEntity.gender,
        birthdate: userEntity.birthdate,
        created_at: userEntity.createdAt,
        updated_at: userEntity.updatedAt
      };

      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify(responseBody),
      };

      callback(null, response);
    })
    .catch((error) => {
      // TODO ログにStackTraceを出力させる対応が必要 @keita-nishimoto
      console.error("findUserError", error);

      const errorResponse = new ErrorResponse(error);
      const response = errorResponse.getResponse();

      callback(null, response);
    });
};

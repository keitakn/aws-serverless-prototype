import * as sourceMapSupport from "source-map-support";
import * as lambda from "aws-lambda";
import * as uuid from "uuid";
import ErrorResponse from "../domain/ErrorResponse";
import AwsSdkFactory from "../factories/AwsSdkFactory";
import UserRepository from "../repositories/UserRepository";
import Environment from "../infrastructures/Environment";
import UserEntity from "../domain/user/UserEntity";
import PasswordService from "../domain/auth/PasswordService";
import {SuccessResponse} from "../domain/SuccessResponse";

sourceMapSupport.install();

let dynamoDbDocumentClient = AwsSdkFactory.getInstance().createDynamoDbDocumentClient();

/**
 * ユーザーを作成する
 *
 * @param event
 * @param context
 * @param callback
 */
export const create = async (
  event: lambda.APIGatewayEvent,
  context: lambda.Context,
  callback: lambda.Callback
): Promise<void> => {
  // TODO このあたりの処理はリクエストオブジェクトに集約する @keita-nishimoto
  try {
    const environment = new Environment(event);

    let requestBody;
    if (environment.isLocal() === true) {
      requestBody = event.body;
    } else {
      const eventBody: any = event.body;
      requestBody = JSON.parse(eventBody);
    }

    const nowDateTime = new Date().getTime();

    const userEntity = new UserEntity(uuid.v4(), nowDateTime);
    const passwordHash = PasswordService.generatePasswordHash(requestBody.password);

    userEntity.email = requestBody.email;
    userEntity.emailVerified = 0;
    userEntity.passwordHash = passwordHash;
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
    await userRepository.save(userEntity);

    const responseBody = {
      id: userEntity.id,
      email: userEntity.email,
      email_verified: userEntity.emailVerified,
      password_hash: userEntity.passwordHash.passwordHash,
      name: userEntity.name,
      gender: userEntity.gender,
      birthdate: userEntity.birthdate,
      created_at: userEntity.createdAt,
      updated_at: userEntity.updatedAt
    };

    const successResponse = new SuccessResponse(responseBody, 201);

    callback(undefined, successResponse.getResponse());
  } catch (error) {
    const errorResponse = new ErrorResponse(error);
    const response = errorResponse.getResponse();

    callback(undefined, response);
  }
};

/**
 * ユーザーを取得する
 *
 * @param event
 * @param context
 * @param callback
 */
export const find = async (
  event: lambda.APIGatewayEvent,
  context: lambda.Context,
  callback: lambda.Callback
): Promise<void> => {
  // TODO このあたりの処理はリクエストオブジェクトに集約する @keita-nishimoto
  try {
    const request = extractRequest(event);
    const userId = request.subject;
    const environment = new Environment(event);
    if (environment.isLocal() === true) {
      dynamoDbDocumentClient = AwsSdkFactory.getInstance().createDynamoDbDocumentClient(
        environment.isLocal()
      );
    }

    const userRepository = new UserRepository(dynamoDbDocumentClient);

    const userEntity = await userRepository.find(userId);

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

    const successResponse = new SuccessResponse(responseBody);

    callback(undefined, successResponse.getResponse());
  } catch (error) {
    const errorResponse = new ErrorResponse(error);
    const response = errorResponse.getResponse();

    callback(undefined, response);
  }
};

/**
 * APIGatewayEventからリクエストパラメータを取り出す
 *
 * @param event
 * @returns {{client_id: number}}
 */
const extractRequest = (event: lambda.APIGatewayEvent): UserRequest.FindRequest => {
  if (event.pathParameters != null) {
    return {
      subject: event.pathParameters.id
    };
  }

  return {
    subject: ""
  };
};

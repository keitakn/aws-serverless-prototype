import * as lambda from "aws-lambda";
import * as sourceMapSupport from "source-map-support";
import * as uuidV4 from "uuid/v4";
import PasswordService from "../domain/auth/PasswordService";
import ErrorResponse from "../domain/ErrorResponse";
import {SuccessResponse} from "../domain/SuccessResponse";
import {UserRequest} from "../domain/user/request/UserRequest";
import {UserEntity} from "../domain/user/UserEntity";
import {UserValidationService} from "../domain/user/UserValidationService";
import {ValidationErrorResponse} from "../domain/ValidationErrorResponse";
import AwsSdkFactory from "../factories/AwsSdkFactory";
import {RequestFactory} from "../factories/RequestFactory";
import UserRepository from "../repositories/UserRepository";

sourceMapSupport.install();

const dynamoDbDocumentClient = AwsSdkFactory.createDynamoDbDocumentClient();

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
  callback: lambda.Callback,
): Promise<void> => {
  try {
    const requestFactory = new RequestFactory(event);
    const request = requestFactory.create();

    const validateResultObject = UserValidationService.createValidate(request);
    if (Object.keys(validateResultObject).length !== 0) {
      const validationErrorResponse = new ValidationErrorResponse(validateResultObject);
      callback(undefined, validationErrorResponse.getResponse());
      return;
    }

    const nowDateTime = new Date().getTime();

    const userBuilder = new UserEntity.Builder();

    userBuilder.subject = uuidV4();
    userBuilder.email = request.email;
    userBuilder.emailVerified = 0;
    userBuilder.passwordHash = PasswordService.generatePasswordHash(request.password);
    userBuilder.name = request.name;
    userBuilder.gender = request.gender;
    userBuilder.birthdate = request.birthdate;
    userBuilder.createdAt = nowDateTime;
    userBuilder.updatedAt = nowDateTime;

    const userEntity = userBuilder.build();

    const userRepository = new UserRepository(dynamoDbDocumentClient);
    await userRepository.save(userEntity);

    const responseBody = {
      subject: userEntity.subject,
      email: userEntity.email,
      email_verified: userEntity.emailVerified,
      password_hash: userEntity.passwordHash.passwordHash,
      name: userEntity.name,
      gender: userEntity.gender,
      birthdate: userEntity.birthdate,
      created_at: userEntity.createdAt,
      updated_at: userEntity.updatedAt,
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
  callback: lambda.Callback,
): Promise<void> => {
  try {
    const request = extractRequest(event);
    const validateResultObject = UserValidationService.findValidate(request);
    if (Object.keys(validateResultObject).length !== 0) {
      const validationErrorResponse = new ValidationErrorResponse(validateResultObject);
      callback(undefined, validationErrorResponse.getResponse());
      return;
    }

    const subject = request.subject;

    const userRepository = new UserRepository(dynamoDbDocumentClient);

    const userEntity = await userRepository.find(subject);

    const responseBody = {
      subject: userEntity.subject,
      email: userEntity.email,
      email_verified: userEntity.emailVerified,
      name: userEntity.name,
      gender: userEntity.gender,
      birthdate: userEntity.birthdate,
      created_at: userEntity.createdAt,
      updated_at: userEntity.updatedAt,
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
      subject: event.pathParameters.id,
    };
  }

  return {
    subject: "",
  };
};

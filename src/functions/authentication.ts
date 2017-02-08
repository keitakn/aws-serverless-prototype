import * as sourceMapSupport from "source-map-support";
import * as lambda from "aws-lambda";
import {LambdaExecutionEvent} from "../../types";
import Environment from "../infrastructures/Environment";
import UserRepository from "../repositories/UserRepository";
import AwsSdkFactory from "../factories/AwsSdkFactory";
import PasswordService from "../domain/auth/PasswordService";
import UserEntity from "../domain/user/UserEntity";
import UnauthorizedError from "../errors/UnauthorizedError";
import ErrorResponse from "../domain/ErrorResponse";

let dynamoDbDocumentClient = AwsSdkFactory.getInstance().createDynamoDbDocumentClient();

sourceMapSupport.install();

/**
 * 認証を行う
 * この関数はAuthlete.Authentication Callbackに合わせて作成されている事が必要
 *
 * @param event
 * @param context
 * @param callback
 * @link https://www.authlete.com/documents/definitive_guide/authentication_callback
 */
export const authentication = (event: LambdaExecutionEvent, context: lambda.Context, callback: lambda.Callback): void => {

  // TODO これは仮実装、準備が整い次第本格的な実装を行う。 @keita-koga
  const environment = new Environment(event);

  let requestBody;
  if (environment.isLocal() === true) {
    requestBody = event.body;

    dynamoDbDocumentClient = AwsSdkFactory.getInstance().createDynamoDbDocumentClient(
      environment.isLocal()
    );
  } else {
    requestBody = JSON.parse(event.body);
  }

  const userId: string = requestBody.id;
  const password: string = requestBody.password;

  const userRepository = new UserRepository(dynamoDbDocumentClient);
  userRepository.find(userId)
    .then((userEntity: UserEntity) => {

      const requestPassword = PasswordService.generatePasswordHash(password);
      if (userEntity.verifyPassword(requestPassword) === false) {
        throw new UnauthorizedError();
      }

      const responseBody = {
        authenticated: true,
        subject: userId,
        claims: {
          name: userEntity.name,
          email: userEntity.email,
          email_verified: userEntity.emailVerified,
          gender: userEntity.gender,
          birthdate: userEntity.birthdate
        }
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
    .catch((error: Error) => {
      console.error("authentication", error);

      const errorResponse = new ErrorResponse(error);
      const response = errorResponse.getResponse();

      callback(null, response);
    });
};

import UserEntity from "../domain/user/UserEntity";
import {UserRepositoryInterface} from "../domain/user/UserRepositoryInterface";
import NotFoundError from "../errors/NotFoundError";
import {DynamoDB} from "aws-sdk";
import {DynamoDbResponse} from "./DynamoDbResponse";

/**
 * UserRepository
 *
 * @author keita-nishimoto
 * @since 2016-01-18
 */
export default class UserRepository implements UserRepositoryInterface {

  /**
   * constructor
   *
   * @param dynamoDbDocumentClient
   */
  constructor(private dynamoDbDocumentClient: DynamoDB.DocumentClient) {
  }

  /**
   * ユーザーを取得する
   *
   * @param userId
   * @returns {Promise<UserEntity>}
   */
  find(userId: string): Promise<UserEntity> {
    const params = {
      TableName: "Users",
      Key: {
        id: userId
      }
    };

    return new Promise<UserEntity>((resolve: Function, reject: Function) => {
      this.dynamoDbDocumentClient.get(params, (error: Error, dbResponse: DynamoDbResponse.User) => {
        try {
          if (error) {
            reject(error);
          }

          if (Object.keys(dbResponse).length === 0) {
            throw new NotFoundError();
          }

          const userEntity = new UserEntity(dbResponse.Item.id, dbResponse.Item.created_at);
          userEntity.email = dbResponse.Item.email;
          userEntity.emailVerified = dbResponse.Item.email_verified;
          userEntity.name = dbResponse.Item.name;
          userEntity.gender = dbResponse.Item.gender;
          userEntity.birthdate = dbResponse.Item.birthdate;
          userEntity.updatedAt = dbResponse.Item.updated_at;

          resolve(userEntity);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  /**
   * ユーザーを保存する
   *
   * @param userEntity
   * @returns {Promise<UserEntity>}
   */
  save(userEntity: UserEntity): Promise<UserEntity> {
    const userCreateParams = {
      id: userEntity.id,
      email: userEntity.email,
      email_verified: userEntity.emailVerified,
      name: userEntity.name,
      gender: userEntity.gender,
      birthdate: userEntity.birthdate,
      created_at: userEntity.createdAt,
      updated_at: userEntity.updatedAt
    };

    const params = {
      TableName: "Users",
      Item: userCreateParams
    };

    return new Promise<UserEntity>((resolve: Function, reject: Function) => {
      this.dynamoDbDocumentClient.put(params, (error: Error) => {
        try {
          if (error) {
            reject(error);
          }

          resolve(userEntity);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

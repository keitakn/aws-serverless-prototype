import UserEntity from "../domain/user/UserEntity";
import {UserRepositoryInterface} from "../domain/user/UserRepositoryInterface";
import NotFoundError from "../errors/NotFoundError";
import {DynamoDB} from "aws-sdk";
import {DynamoDbResponse} from "./DynamoDbResponse";
import PasswordHash from "../domain/auth/PasswordHash";
import InternalServerError from "../errors/InternalServerError";

/**
 * UserRepository
 *
 * @author keita-nishimoto
 * @since 2017-01-18
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
    return new Promise<UserEntity>((resolve: Function, reject: Function) => {
      const params = {
        TableName: this.getUsersTableName(),
        Key: {
          id: userId
        }
      };

      this.dynamoDbDocumentClient.get(params, (error: Error, dbResponse: DynamoDbResponse.User) => {
        try {
          if (error) {
            reject(
              new InternalServerError(error.message)
            );
          }

          if (Object.keys(dbResponse).length === 0) {
            reject(new NotFoundError());
          }

          const userEntity = new UserEntity(dbResponse.Item.id, dbResponse.Item.created_at);
          userEntity.email = dbResponse.Item.email;
          userEntity.emailVerified = dbResponse.Item.email_verified;
          userEntity.passwordHash = new PasswordHash(dbResponse.Item.password_hash);
          userEntity.name = dbResponse.Item.name;
          userEntity.gender = dbResponse.Item.gender;
          userEntity.birthdate = dbResponse.Item.birthdate;
          userEntity.updatedAt = dbResponse.Item.updated_at;

          resolve(userEntity);
        } catch (error) {
          reject(
            new InternalServerError(error.message)
          );
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
    return new Promise<UserEntity>((resolve: Function, reject: Function) => {
      const userCreateParams = {
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

      const params = {
        TableName: this.getUsersTableName(),
        Item: userCreateParams
      };

      this.dynamoDbDocumentClient.put(params, (error: Error) => {
        try {
          if (error) {
            reject(
              new InternalServerError(error.message)
            );
          }

          resolve(userEntity);
        } catch (error) {
          reject(
            new InternalServerError(error.message)
          );
        }
      });
    });
  }

  /**
   * 実行環境のUsersテーブル名を取得する
   *
   * @returns {string}
   */
  private getUsersTableName(): string {
    return process.env.USERS_TABLE_NAME;
  }
}

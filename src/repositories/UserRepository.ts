import {UserEntity} from "../domain/user/UserEntity";
import {UserRepositoryInterface} from "../domain/user/UserRepositoryInterface";
import NotFoundError from "../errors/NotFoundError";
import {DynamoDB} from "aws-sdk";
import {DynamoDbResponse} from "./DynamoDbResponse";
import PasswordHash from "../domain/auth/PasswordHash";
import InternalServerError from "../errors/InternalServerError";
import {Logger} from "../infrastructures/Logger";

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
   * @param subject
   * @returns {Promise<UserEntity.Entity>}
   */
  find(subject: string): Promise<UserEntity.Entity> {
    return new Promise<UserEntity.Entity>((resolve: Function, reject: Function) => {
      const params = {
        TableName: this.getUsersTableName(),
        Key: {
          id: subject
        }
      };

      this.dynamoDbDocumentClient
        .get(params)
        .promise()
        .then((dbResponse: DynamoDbResponse.User) => {
          if (Object.keys(dbResponse).length === 0) {
            return reject(new NotFoundError());
          }

          const builder = new UserEntity.Builder();

          builder.subject = dbResponse.Item.id;
          builder.email = dbResponse.Item.email;
          builder.emailVerified = dbResponse.Item.email_verified;
          builder.passwordHash = new PasswordHash(dbResponse.Item.password_hash);
          builder.name = dbResponse.Item.name;
          builder.gender = dbResponse.Item.gender;
          builder.birthdate = dbResponse.Item.birthdate;
          builder.createdAt = dbResponse.Item.created_at;
          builder.updatedAt = dbResponse.Item.updated_at;

          const userEntity = builder.build();

          return resolve(userEntity);
        })
        .catch((error) => {
          Logger.critical(error);
          return reject(
            new InternalServerError(error.message)
          );
        });
    });
  }

  /**
   * ユーザーを保存する
   *
   * @param userEntity
   * @returns {Promise<UserEntity.Entity>}
   */
  async save(userEntity: UserEntity.Entity): Promise<UserEntity.Entity> {
    try {
      const userCreateParams = {
        id: userEntity.subject,
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

      await this.dynamoDbDocumentClient.put(params).promise();

      return userEntity;
    } catch (error) {
      Logger.critical(error);
      return Promise.reject(
        new InternalServerError(error.message)
      );
    }
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

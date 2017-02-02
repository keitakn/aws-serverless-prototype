import UserEntity from "../domain/user/UserEntity";
import {UserRepositoryInterface} from "../domain/user/UserRepositoryInterface";
import NotFoundError from "../errors/NotFoundError";
import {DynamoDB} from "aws-sdk";

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
      this.dynamoDbDocumentClient.get(params, (error: any, data: any) => {
        try {
          if (error) {
            reject(error);
          }

          if (Object.keys(data).length === 0) {
            throw new NotFoundError();
          }

          const userEntity = new UserEntity(data.Item.id, data.Item.created_at);
          userEntity.email = data.Item.email;
          userEntity.emailVerified = data.Item.email_verified;
          userEntity.name = data.Item.name;
          userEntity.gender = data.Item.gender;
          userEntity.birthdate = data.Item.birthdate;
          userEntity.updatedAt = data.Item.updated_at;

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
      this.dynamoDbDocumentClient.put(params, (error: any) => {
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

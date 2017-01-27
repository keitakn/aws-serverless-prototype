import * as AWS from "aws-sdk";
import UserEntity from "../domain/user/user-entity";
import {UserRepositoryInterface} from "../domain/user/user-repository-interface";
import NotFoundError from "../errors/not-found-error";

/**
 * UserRepository
 *
 * @author keita-nishimoto
 * @since 2016-01-18
 */
export default class UserRepository implements UserRepositoryInterface {

  /**
   * 自身のインスタンス
   */
  private static _instance: UserRepository;

  /**
   * constructor
   * シングルトンなのでprivateで宣言
   */
  constructor() {
    if (UserRepository._instance) {
      throw new Error("Error: Instantiation failed: Use UserRepository.getInstance() instead of new.");
    }
    UserRepository._instance = this;
  }

  /**
   * 自身のインスタンスを取得する
   *
   * @returns {UserRepository}
   */
  public static getInstance(): UserRepository {
    if (UserRepository._instance === null) {
      UserRepository._instance = new UserRepository();
    }

    return UserRepository._instance;
  }

  /**
   * ユーザーを取得する
   *
   * @param userId
   * @returns {Promise<UserEntity>}
   */
  find(userId: string): Promise<UserEntity> {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    const params = {
      TableName: "Users",
      Key: {
        id: userId
      }
    };

    return new Promise<UserEntity>((resolve: Function, reject: Function) => {
      dynamoDb.get(params, (error: any, data: any) => {
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
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

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
      dynamoDb.put(params, (error: any) => {
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

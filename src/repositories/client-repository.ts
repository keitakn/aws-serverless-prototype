import {ClientEntity} from "../domain/client/client-entity";
import * as AWS from "aws-sdk";
import {ClientRepositoryInterface} from "../domain/client/client-repository-interface";

/**
 * ClientRepository
 *
 * @author keita-nishimoto
 * @since 2016-01-16
 */
export class ClientRepository implements ClientRepositoryInterface {

  /**
   * クライアントを取得する
   *
   * @param clientId
   * @returns {Promise<ClientEntity>}
   */
  find(clientId: string): Promise<ClientEntity> {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: "Clients",
      Key: {
        id: clientId
      }
    };

    return new Promise<ClientEntity>((resolve: Function, reject: Function) => {

      try {
        dynamoDb.get(params, (error: any, data: any) => {
          if (error) {
            reject(error);
          }

          const clientEntity = new ClientEntity(data.Item.id, data.Item.created_at);

          clientEntity.secret = data.Item.secret;
          clientEntity.name = data.Item.name;
          clientEntity.redirectUri = data.Item.redirect_uri;
          clientEntity.updatedAt = data.Item.updated_at;

          resolve(clientEntity);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * クライアントを保存する
   *
   * @param clientEntity
   * @returns {Promise<ClientEntity>}
   */
  save(clientEntity: ClientEntity): Promise<ClientEntity> {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    const clientCreateParams = {
      id: clientEntity.id,
      secret: clientEntity.secret,
      name: clientEntity.name,
      redirect_uri: clientEntity.redirectUri,
      created_at: clientEntity.createdAt,
      updated_at: clientEntity.updatedAt
    };

    const putParam = {
      TableName: "Clients",
      Item: clientCreateParams
    };

    return new Promise<ClientEntity>((resolve: Function, reject: Function) => {
      try {
        dynamoDb.put(putParam, (error: any) => {
          if (error) {
            reject(error);
          }

          resolve(clientEntity);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

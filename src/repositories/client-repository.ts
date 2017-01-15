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

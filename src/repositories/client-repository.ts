import ClientEntity from "../domain/client/client-entity";
import {ClientRepositoryInterface} from "../domain/client/client-repository-interface";
import NotFoundError from "../errors/not-found-error";
import {DynamoDB} from "aws-sdk";

/**
 * ClientRepository
 *
 * @author keita-nishimoto
 * @since 2016-01-16
 */
export default class ClientRepository implements ClientRepositoryInterface {

  /**
   * constructor
   *
   * @param dynamoDbDocumentClient
   */
  constructor(private dynamoDbDocumentClient: DynamoDB.DocumentClient) {
  }

  /**
   * クライアントを取得する
   *
   * @param clientId
   * @returns {Promise<ClientEntity>}
   */
  find(clientId: string): Promise<ClientEntity> {

    const params = {
      TableName: "Clients",
      Key: {
        id: clientId
      }
    };

    return new Promise<ClientEntity>((resolve: Function, reject: Function) => {
      this.dynamoDbDocumentClient.get(params, (error: any, data: any) => {
        try {
          if (error) {
            reject(error);
          }

          if (Object.keys(data).length === 0) {
            throw new NotFoundError();
          }

          const clientEntity = new ClientEntity(data.Item.id, data.Item.created_at);

          clientEntity.secret = data.Item.secret;
          clientEntity.name = data.Item.name;
          clientEntity.redirectUri = data.Item.redirect_uri;
          clientEntity.updatedAt = data.Item.updated_at;

          resolve(clientEntity);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  /**
   * クライアントを保存する
   *
   * @param clientEntity
   * @returns {Promise<ClientEntity>}
   */
  save(clientEntity: ClientEntity): Promise<ClientEntity> {

    const clientCreateParams = {
      id: clientEntity.id,
      secret: clientEntity.secret,
      name: clientEntity.name,
      redirect_uri: clientEntity.redirectUri,
      created_at: clientEntity.createdAt,
      updated_at: clientEntity.updatedAt
    };

    const params = {
      TableName: "Clients",
      Item: clientCreateParams
    };

    return new Promise<ClientEntity>((resolve: Function, reject: Function) => {
      this.dynamoDbDocumentClient.put(params, (error: any) => {
        try {
          if (error) {
            reject(error);
          }

          resolve(clientEntity);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

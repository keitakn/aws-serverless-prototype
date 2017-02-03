import ClientEntity from "../domain/client/ClientEntity";
import {ClientRepositoryInterface} from "../domain/client/ClientRepositoryInterface";
import NotFoundError from "../errors/NotFoundError";
import {DynamoDB} from "aws-sdk";
import {DynamoDbResponse} from "./DynamoDbResponse";
import Environment from "../infrastructures/Environment";

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
  constructor(private dynamoDbDocumentClient: DynamoDB.DocumentClient, private environment: Environment) {
  }

  /**
   * クライアントを取得する
   *
   * @param clientId
   * @returns {Promise<ClientEntity>}
   */
  find(clientId: string): Promise<ClientEntity> {

    const tableName = `${this.environment.getStage()}_Clients`;
    const params = {
      TableName: tableName,
      Key: {
        id: clientId
      }
    };

    return new Promise<ClientEntity>((resolve: Function, reject: Function) => {
      this.dynamoDbDocumentClient.get(params, (error: Error, dbResponse: DynamoDbResponse.Client) => {
        try {
          if (error) {
            reject(error);
          }

          if (Object.keys(dbResponse).length === 0) {
            throw new NotFoundError();
          }

          const clientEntity = new ClientEntity(dbResponse.Item.id, dbResponse.Item.created_at);

          clientEntity.secret = dbResponse.Item.secret;
          clientEntity.name = dbResponse.Item.name;
          clientEntity.redirectUri = dbResponse.Item.redirect_uri;
          clientEntity.updatedAt = dbResponse.Item.updated_at;

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

    const tableName = `${this.environment.getStage()}_Clients`;
    const params = {
      TableName: tableName,
      Item: clientCreateParams
    };

    return new Promise<ClientEntity>((resolve: Function, reject: Function) => {
      this.dynamoDbDocumentClient.put(params, (error: Error) => {
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

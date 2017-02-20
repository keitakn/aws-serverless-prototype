import * as request from "request";
import ClientEntity from "../domain/client/ClientEntity";
import {ClientRepositoryInterface} from "../domain/client/ClientRepositoryInterface";
import NotFoundError from "../errors/NotFoundError";
import {DynamoDB} from "aws-sdk";
import {DynamoDbResponse} from "./DynamoDbResponse";
import {AuthleteResponse} from "../domain/auth/AuthleteResponse";
import {ClientRequest} from "../domain/client/ClientRequest";
import ClientCreateResponse = AuthleteResponse.ClientCreateResponse;

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
      TableName: this.getClientsTableName(),
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
          clientEntity.updatedAt = dbResponse.Item.updated_at;

          resolve(clientEntity);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  /**
   * クライアントを作成する
   *
   * @param createClientRequest
   * @returns {Promise<ClientEntity>}
   */
  create(createClientRequest: ClientRequest.CreateClientRequest): Promise<ClientEntity> {
    return new Promise<ClientEntity>((resolve: Function, reject: Function) => {
      this.createInAuthleteApi(createClientRequest)
        .then((clientEntity) => {
          return this.saveToDb(clientEntity);
        })
        .then((clientEntity) => {
          resolve(clientEntity);
        })
        .catch((error: Error) => {
          console.error(error);
          reject(error);
        });
    });
  }

  /**
   * Authlete APIでクライアントを作成する
   *
   * @param createClientRequest
   * @returns {Promise<ClientEntity>}
   */
  private createInAuthleteApi(createClientRequest: ClientRequest.CreateClientRequest): Promise<ClientEntity> {
    return new Promise<ClientEntity>((resolve: Function, reject: Function) => {
      const headers = {
        "Content-Type": "application/json"
      };

      const options = {
        url: "https://api.authlete.com/api/client/create",
        method: "POST",
        auth: {
          username: this.getAuthleteApiKey(),
          pass: this.getAuthleteApiSecret()
        },
        headers: headers,
        json: true,
        body: {
          developer: createClientRequest.developer,
          clientType: createClientRequest.clientType,
          redirectUris: createClientRequest.redirectUris,
          responseTypes: createClientRequest.responseTypes,
          grantTypes: createClientRequest.grantTypes,
          applicationType: createClientRequest.applicationType
        }
      };

      request(options, (error: Error, response: any, clientCreateResponse: AuthleteResponse.ClientCreateResponse) => {
        try {

          if (error) {
            reject(error);
          }

          if (response.statusCode !== 201) {
            console.error(response);
            reject(new Error("Internal Server Error"));
          }

          const clientEntity = new ClientEntity(
            clientCreateResponse.clientId,
            clientCreateResponse.createdAt
          );

          clientEntity.secret          = clientCreateResponse.clientSecret;
          clientEntity.name            = clientCreateResponse.clientName;
          clientEntity.developer       = clientCreateResponse.developer;
          clientEntity.applicationType = clientCreateResponse.applicationType;
          clientEntity.redirectUris    = clientCreateResponse.redirectUris;
          clientEntity.grantTypes      = clientCreateResponse.grantTypes;
          clientEntity.scopes          = createClientRequest.scopes;
          clientEntity.updatedAt       = clientCreateResponse.modifiedAt;

          resolve(clientEntity);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  /**
   * クライアントをDBに保存する
   *
   * @param clientEntity
   * @returns {Promise<ClientEntity>}
   */
  private saveToDb(clientEntity: ClientEntity): Promise<ClientEntity> {
    return new Promise<ClientEntity>((resolve: Function, reject: Function) => {

      const clientSaveParams = {
        id: clientEntity.id,
        scopes: clientEntity.scopes,
        created_at: clientEntity.createdAt,
        updated_at: clientEntity.updatedAt
      };

      const params = {
        TableName: this.getClientsTableName(),
        Item: clientSaveParams
      };

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

  /**
   * 実行環境のClientsテーブル名を取得する
   *
   * @returns {string}
   */
  private getClientsTableName(): string {
    return process.env.CLIENTS_TABLE_NAME;
  }

  /**
   * 環境変数からAuthleteのAPIキーを取得する
   *
   * @returns {string}
   */
  private getAuthleteApiKey(): string {
    return process.env.AUTHLETE_API_KEY;
  }

  /**
   * 環境変数からAuthleteのAPIシークレットを取得する
   *
   * @returns {string}
   */
  private getAuthleteApiSecret(): string {
    return process.env.AUTHLETE_API_SECRET;
  }
}

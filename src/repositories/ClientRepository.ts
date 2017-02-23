import * as request from "request";
import ClientEntity from "../domain/client/ClientEntity";
import {ClientRepositoryInterface} from "../domain/client/ClientRepositoryInterface";
import {AuthleteResponse} from "../domain/auth/AuthleteResponse";
import ClientCreateResponse = AuthleteResponse.ClientResponse;
import NotFoundError from "../errors/NotFoundError";
import {Logger} from "../infrastructures/Logger";

/**
 * ClientRepository
 *
 * @author keita-nishimoto
 * @since 2017-01-16
 */
export default class ClientRepository implements ClientRepositoryInterface {

  /**
   * クライアントを取得する
   *
   * @param clientId
   * @returns {Promise<ClientEntity>}
   */
  find(clientId: number): Promise<ClientEntity> {
    return new Promise<ClientEntity>((resolve: Function, reject: Function) => {
      this.fetchFromAPi(clientId)
        .then((clientEntity) => {
          resolve(clientEntity);
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }

  /**
   * Authlete APIからクライアントを取得する
   *
   * @param clientId
   * @returns {Promise<ClientEntity>}
   */
  private fetchFromAPi(clientId: number) {
    return new Promise<ClientEntity>((resolve: Function, reject: Function) => {

      const options = {
        url: `https://api.authlete.com/api/client/get/${clientId}`,
        method: "GET",
        auth: {
          username: this.getAuthleteApiKey(),
          pass: this.getAuthleteApiSecret()
        },
        json: true
      };

      request(options, (error: Error, response: any, clientResponse: AuthleteResponse.ClientResponse) => {
        try {
          if (error) {
            Logger.critical(error);
            reject(error);
          }

          if (response.statusCode === 404) {
            reject(new NotFoundError());
          }

          const clientEntity = new ClientEntity(clientResponse.clientId, clientResponse.createdAt);
          clientEntity.secret          = clientResponse.clientSecret;
          clientEntity.name            = clientResponse.clientName;
          clientEntity.developer       = clientResponse.developer;
          clientEntity.applicationType = clientResponse.applicationType;
          clientEntity.redirectUris    = clientResponse.redirectUris;
          clientEntity.grantTypes      = clientResponse.grantTypes;
          clientEntity.scopes          = clientResponse.extension.requestableScopes;
          clientEntity.updatedAt       = clientResponse.modifiedAt;

          resolve(clientEntity);
        } catch (error) {
          Logger.critical(error);
          reject(error);
        }
      });
    });
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

import axios from "axios";
import {AxiosResponse} from "axios";
import {AxiosError} from "axios";
import ClientEntity from "../domain/client/ClientEntity";
import {ClientRepositoryInterface} from "../domain/client/ClientRepositoryInterface";
import {AuthleteResponse} from "../domain/auth/AuthleteResponse";
import NotFoundError from "../errors/NotFoundError";
import {Logger} from "../infrastructures/Logger";
import {Authlete} from "../config/Authlete";

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

      const requestConfig = {
        auth: {
          username: Authlete.getApiKey(),
          password: Authlete.getApiSecret()
        }
      };

      axios
        .get(`https://api.authlete.com/api/client/get/${clientId}`, requestConfig)
        .then((axiosResponse: AxiosResponse) => {

          const clientResponse: AuthleteResponse.ClientResponse = axiosResponse.data;
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
        })
        .catch((error: AxiosError) => {
          if (error.response != null) {
            if (error.response.status === 404) {
              reject(new NotFoundError());
              return;
            }
          }

          Logger.critical(error);
          reject(error);
        });
    });
  }
}

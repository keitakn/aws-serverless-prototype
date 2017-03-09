import axios from "axios";
import {AxiosResponse} from "axios";
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
  async find(clientId: number): Promise<ClientEntity> {
    return await this.fetchFromAPi(clientId);
  }

  /**
   * Authlete APIからクライアントを取得する
   *
   * @param clientId
   * @returns {Promise<ClientEntity>}
   */
  private async fetchFromAPi(clientId: number): Promise<ClientEntity> {
    try {
      const requestConfig = {
        auth: {
          username: Authlete.getApiKey(),
          password: Authlete.getApiSecret()
        }
      };

      const axiosResponse: AxiosResponse = await axios.get(
        `https://api.authlete.com/api/client/get/${clientId}`,
        requestConfig
      );

      const clientResponse: AuthleteResponse.ClientResponse = axiosResponse.data;
      const clientEntity = new ClientEntity(clientResponse.clientId, clientResponse.createdAt);
      clientEntity.secret          = clientResponse.clientSecret;
      clientEntity.name            = clientResponse.clientName;
      clientEntity.developer       = clientResponse.developer;
      clientEntity.applicationType = clientResponse.applicationType;
      clientEntity.redirectUris    = clientResponse.redirectUris;
      clientEntity.grantTypes      = clientResponse.grantTypes;
      clientEntity.updatedAt       = clientResponse.modifiedAt;

      if ("extension" in clientResponse) {
        if (clientResponse.extension != null) {
          clientEntity.scopes = clientResponse.extension.requestableScopes;
        }
      }

      return clientEntity;
    } catch (error) {
      if (error.response != null) {
        if (error.response.status === 404) {
          throw new NotFoundError();
        }
      }

      Logger.critical(error);
      throw error;
    }
  }
}

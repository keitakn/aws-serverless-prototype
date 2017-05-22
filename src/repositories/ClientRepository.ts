import {AxiosInstance} from "axios";
import {AxiosResponse} from "axios";
import {ClientEntity} from "../domain/client/ClientEntity";
import {ClientRepositoryInterface} from "../domain/client/ClientRepositoryInterface";
import NotFoundError from "../errors/NotFoundError";
import {Logger} from "../infrastructures/Logger";
import {AuthleteAPI} from "../types/authlete/types";

/**
 * ClientRepository
 *
 * @author keita-nishimoto
 * @since 2017-01-16
 */
export default class ClientRepository implements ClientRepositoryInterface {

  /**
   * constructor
   *
   * @param axiosInstance
   */
  constructor(private axiosInstance: AxiosInstance) {
  }

  /**
   * クライアントを取得する
   *
   * @param clientId
   * @returns {Promise<ClientEntity.Entity>}
   */
  public async find(clientId: number): Promise<ClientEntity.Entity> {
    return await this.fetchFromAPi(clientId);
  }

  /**
   * Authlete APIからクライアントを取得する
   *
   * @param clientId
   * @returns {Promise<ClientEntity.Entity>}
   */
  private async fetchFromAPi(clientId: number): Promise<ClientEntity.Entity> {
    try {
      const axiosResponse: AxiosResponse = await this.axiosInstance.get(
        `https://api.authlete.com/api/client/get/${clientId}`,
      );

      const clientResponse: AuthleteAPI.ClientResponse = axiosResponse.data;
      const builder = new ClientEntity.Builder();

      builder.clientId        = clientResponse.clientId;
      builder.clientSecret    = clientResponse.clientSecret;
      builder.name            = clientResponse.clientName;
      builder.developer       = clientResponse.developer;
      builder.applicationType = clientResponse.applicationType;
      builder.redirectUris    = clientResponse.redirectUris;
      builder.grantTypes      = clientResponse.grantTypes;
      builder.createdAt       = clientResponse.createdAt;
      builder.updatedAt       = clientResponse.modifiedAt;

      if ("extension" in clientResponse) {
        if (clientResponse.extension != null) {
          builder.scopes = clientResponse.extension.requestableScopes;
        }
      }

      return builder.build();
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

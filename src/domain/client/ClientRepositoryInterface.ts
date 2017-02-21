import ClientEntity from "./ClientEntity";
import {ClientRequest} from "./ClientRequest";

/**
 * ClientRepositoryInterface
 *
 * @author keita-nishimoto
 * @since 2016-01-16
 */
export interface ClientRepositoryInterface {
  /**
   * クライアントを取得する
   *
   * @param clientId
   * @returns {Promise<ClientEntity>}
   */
  find(clientId: number): Promise<ClientEntity>;

  /**
   * クライアントを作成する
   *
   * @param createClientRequest
   * @returns {Promise<ClientEntity>}
   */
  create(createClientRequest: ClientRequest.CreateClientRequest): Promise<ClientEntity>;
}

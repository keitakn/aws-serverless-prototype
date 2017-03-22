import {ClientEntity} from "./ClientEntity";

/**
 * ClientRepositoryInterface
 *
 * @author keita-nishimoto
 * @since 2017-01-16
 */
export interface ClientRepositoryInterface {
  /**
   * クライアントを取得する
   *
   * @param clientId
   * @returns {Promise<ClientEntity.Entity>}
   */
  find(clientId: number): Promise<ClientEntity.Entity>;
}

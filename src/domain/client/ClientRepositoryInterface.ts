import ClientEntity from "./ClientEntity";

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
}

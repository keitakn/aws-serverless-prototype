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
  find(clientId: string): Promise<ClientEntity>;

  /**
   * クライアントを保存する
   *
   * @param clientEntity
   * @returns {Promise<ClientEntity>}
   */
  save(clientEntity: ClientEntity): Promise<ClientEntity>;
}

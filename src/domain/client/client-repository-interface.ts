import {ClientEntity} from "./client-entity";

/**
 * ClientRepositoryInterface
 *
 * @author keita-nishimoto
 * @since 2016-01-16
 */
export interface ClientRepositoryInterface {
  save(clientEntity: ClientEntity): Promise<ClientEntity>;
}

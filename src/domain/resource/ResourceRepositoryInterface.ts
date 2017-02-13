import {ResourceEntity} from "./ResourceEntity";

/**
 * ResourceRepositoryInterface
 *
 * @author keita-nishimoto
 * @since 2017-02-13
 */
export interface ResourceRepositoryInterface {

  /**
   * リソースを保存する
   *
   * @param resourceEntity
   * @returns {Promise<ResourceEntity>}
   */
  save(resourceEntity: ResourceEntity): Promise<ResourceEntity>;
}

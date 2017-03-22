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
   * @returns {Promise<ResourceEntity.Entity>}
   */
  save(resourceEntity: ResourceEntity.Entity): Promise<ResourceEntity.Entity>;

  /**
   * リソースを取得する
   *
   * @param resourceId
   * @returns {Promise<ResourceEntity.Entity>}
   */
  find(resourceId: string): Promise<ResourceEntity.Entity>;

  /**
   * リソースを削除する
   *
   * @param resourceId
   * @returns {Promise<void>}
   */
  destroy(resourceId: string): Promise<void>;
}

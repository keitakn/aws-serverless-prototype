import {UserEntity} from "./UserEntity";

/**
 * UserRepositoryInterface
 *
 * @author keita-nishimoto
 * @since 2017-01-18
 */
export interface UserRepositoryInterface {

  /**
   * ユーザーを取得する
   *
   * @param userId
   * @returns {Promise<UserEntity.Entity>}
   */
  find(userId: string): Promise<UserEntity.Entity>;

  /**
   * ユーザーを保存する
   *
   * @param userEntity
   * @returns {Promise<UserEntity.Entity>}
   */
  save(userEntity: UserEntity.Entity): Promise<UserEntity.Entity>;
}

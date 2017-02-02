import UserEntity from "./UserEntity";

/**
 * UserRepositoryInterface
 *
 * @author keita-nishimoto
 * @since 2016-01-18
 */
export interface UserRepositoryInterface {

  /**
   * ユーザーを取得する
   *
   * @param userId
   * @returns {Promise<UserEntity>}
   */
  find(userId: string): Promise<UserEntity>;

  /**
   * ユーザーを保存する
   *
   * @param userEntity
   * @returns {Promise<UserEntity>}
   */
  save(userEntity: UserEntity): Promise<UserEntity>;
}

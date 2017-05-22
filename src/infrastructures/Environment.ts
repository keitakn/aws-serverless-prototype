/**
 * Environment
 *
 * @author keita-nishimoto
 * @since 2017-02-01
 */
export default class Environment {

  /**
   * ローカル環境かどうかを判定する
   *
   * @returns {boolean}
   */
  public static isLocal(): boolean {

    if (process.env.IS_OFFLINE) {
      return true;
    }

    return false;
  }
}

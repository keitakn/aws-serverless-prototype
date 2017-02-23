/**
 * 401 Unauthorized
 * 認証失敗時に利用する
 *
 * @author keita-nishimoto
 * @since 2017-02-07
 */
export default class UnauthorizedError extends Error {
  /**
   * constructor
   *
   * @param message
   */
  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

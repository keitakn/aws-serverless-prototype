/**
 * 404 Not Found Error
 * 対象のリソースが見つからない場合に利用する
 *
 * @author keita-nishimoto
 * @since 2017-01-18
 */
export default class NotFoundError extends Error {
  /**
   * constructor
   *
   * @param message
   */
  constructor(message: string = "Not Found") {
    super(message);
    this.name = "NotFoundError";
  }
}

/**
 * UserRequest
 * ユーザー系APIのリクエスト型定義
 *
 * @author keita-nishimoto
 * @since 2017-03-13
 */
namespace UserRequest {
  /**
   * ユーザー取得のリクエスト
   */
  export interface FindRequest {
    subject: string;
  }
}

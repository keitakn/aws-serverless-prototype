/**
 * UserRequest
 * ユーザー系APIのリクエスト型定義
 *
 * @author keita-nishimoto
 * @since 2017-03-13
 */
export namespace UserRequest {
  /**
   * ユーザー作成のリクエスト
   */
  export interface CreateRequest {
    email: string;
    password: string;
    name: string;
    gender: string;
    birthdate: string;
  }

  /**
   * ユーザー取得のリクエスト
   */
  export interface FindRequest {
    subject: string;
  }
}

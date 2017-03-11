/**
 * ClientRequest
 * クライアント系APIのリクエスト型定義
 *
 * @author keita-nishimoto
 * @since 2017-03-13
 */
export namespace ClientRequest {
  /**
   * クライアント取得のリクエスト
   */
  export interface FindRequest {
    client_id: number;
  }
}



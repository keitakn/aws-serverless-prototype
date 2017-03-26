/**
 * ResourceRequest
 * リソース系APIのリクエスト型定義
 *
 * @author keita-nishimoto
 * @since 2017-03-13
 */
export namespace ResourceRequest {
  /**
   * リソース作成のリクエスト
   */
  export interface CreateRequest {
    http_method: string;
    resource_path: string;
    name: string;
    scopes: [string];
  }

  /**
   * リソース取得のリクエスト
   */
  export interface FindRequest {
    resource_id: string;
  }
}

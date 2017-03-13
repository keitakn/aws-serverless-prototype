/**
 * ClientRequest
 * リソース系APIのリクエスト型定義
 *
 * @author keita-nishimoto
 * @since 2017-03-13
 */
namespace ResourceRequest {
  /**
   * リソース取得のリクエスト
   */
  export interface FindRequest {
    resource_id: string;
  }
}

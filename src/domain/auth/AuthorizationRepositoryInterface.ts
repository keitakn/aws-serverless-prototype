import {AuthorizationCodeEntity} from "./AuthorizationCodeEntity";
import {AuthRequest} from "./request/AuthRequest";

/**
 * AuthorizationRepositoryInterface
 *
 * @author keita-nishimoto
 * @since 2017-03-06
 */
export interface AuthorizationRepositoryInterface {

  /**
   * 認可コードを発行する
   *
   * @param request
   * @returns {Promise<AuthorizationCodeEntity.Entity>}
   */
  issueAuthorizationCode(request: AuthRequest.IssueAuthorizationCodeRequest): Promise<AuthorizationCodeEntity.Entity>;
}

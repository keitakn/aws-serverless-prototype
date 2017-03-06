import {AuthorizationCodeEntity} from "./AuthorizationCodeEntity";
import {AuthorizationRequest} from "./request/AuthorizationRequest";

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
   * @param authorizationRequest
   * @returns {Promise<AuthorizationCodeEntity>}
   */
  issueAuthorizationCode(authorizationRequest:  AuthorizationRequest.Request): Promise<AuthorizationCodeEntity>;
}

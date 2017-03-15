import * as querystring from "querystring";
import {AuthleteAPI} from "../../types/authlete/types";

/**
 * AuthorizationCodeEntityInterface
 *
 * @author keita-nishimoto
 * @since 2017-02-16
 */
interface AuthorizationCodeEntityInterface {
  authorizationIssueResponse: AuthleteAPI.AuthorizationIssueResponse;
  code: string;
  state: string;
  responseContent: string;
}

/**
 * AuthorizationCodeEntity
 *
 * @author keita-nishimoto
 * @since 2017-02-16
 */
export class AuthorizationCodeEntity implements AuthorizationCodeEntityInterface {

  /**
   * 認可コード
   */
  private _code: string;

  /**
   * リダイレクトURI + 認可コード等のqueryパラメータが付与されたURI
   */
  private _responseContent: string;

  /**
   * state
   */
  private _state: string;

  /**
   * constructor
   *
   * @param _authorizationIssueResponse
   */
  constructor(private _authorizationIssueResponse: AuthleteAPI.AuthorizationIssueResponse) {
    this._code = _authorizationIssueResponse.authorizationCode;
    this._responseContent = _authorizationIssueResponse.responseContent;
    this.extractState();
  }

  /**
   * @returns {AuthleteAPI.AuthorizationIssueResponse}
   */
  get authorizationIssueResponse(): AuthleteAPI.AuthorizationIssueResponse {
    return this._authorizationIssueResponse;
  }

  /**
   * @returns {string}
   */
  get code(): string {
    return this._code;
  }

  /**
   * @returns {string}
   */
  get responseContent(): string {
    return this._responseContent;
  }

  /**
   * @returns {string}
   */
  get state(): string {
    return this._state;
  }

  /**
   * responseContentからstateを取り出す
   */
  private extractState() {
    const query = this.responseContent.substr(
      this.responseContent.indexOf("?") + 1
    );

    const queries = querystring.parse(query);

    this._state = queries.state;
  }
}

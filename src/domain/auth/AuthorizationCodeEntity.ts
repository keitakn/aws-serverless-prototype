import * as querystring from "querystring";
import {AuthleteAPI} from "../../types/authlete/types";

/**
 * AuthorizationCodeEntity
 *
 * @author keita-nishimoto
 * @since 2017-03-30
 */
export namespace AuthorizationCodeEntity {

  /**
   * Builder
   *
   * @author keita-nishimoto
   * @since 2017-03-30
   */
  export class Builder {
    /**
     * /auth/authorization/issue APIのレスポンス
     */
    private _authorizationIssueResponse: AuthleteAPI.AuthorizationIssueResponse;

    /**
     * @returns {AuthleteAPI.AuthorizationIssueResponse}
     */
    get authorizationIssueResponse(): AuthleteAPI.AuthorizationIssueResponse {
      return this._authorizationIssueResponse;
    }

    /**
     * @param value
     */
    set authorizationIssueResponse(value: AuthleteAPI.AuthorizationIssueResponse) {
      this._authorizationIssueResponse = value;
    }

    /**
     * @returns {AuthorizationCodeEntity.Entity}
     */
    public build(): Entity {
      return new Entity(this);
    }
  }

  /**
   * Entity
   *
   * @author keita-nishimoto
   * @since 2017-03-30
   */
  export class Entity {
    /**
     * /auth/authorization/issue APIのレスポンス
     */
    private _authorizationIssueResponse: AuthleteAPI.AuthorizationIssueResponse;

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
     * @param builder
     */
    constructor(builder: Builder) {
      this._code = builder.authorizationIssueResponse.authorizationCode;
      this._responseContent = builder.authorizationIssueResponse.responseContent;
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
        this.responseContent.indexOf("?") + 1,
      );

      const queries = querystring.parse(query);

      this._state = queries.state;
    }
  }
}


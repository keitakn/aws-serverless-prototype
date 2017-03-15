import {AuthleteAPI} from "./types";

/**
 * AuthleteAPIConstant
 * AuthleteのAPIの定数を定義する
 *
 * @author keita-nishimoto
 * @since 2017-03-15
 * @link https://www.authlete.com/documents/apis/reference
 */
export namespace AuthleteAPIConstant {

  /**
   * 利用可能なGrantType
   */
  export namespace GrantTypes {
    export const AUTHORIZATION_CODE: AuthleteAPI.GrantTypes = "AUTHORIZATION_CODE";
    export const IMPLICIT: AuthleteAPI.GrantTypes = "IMPLICIT";
    export const PASSWORD: AuthleteAPI.GrantTypes = "PASSWORD";
    export const CLIENT_CREDENTIALS: AuthleteAPI.GrantTypes = "CLIENT_CREDENTIALS";
    export const REFRESH_TOKEN: AuthleteAPI.GrantTypes = "REFRESH_TOKEN";
  }

  /**
   * Introspectionレスポンスのaction
   */
  export namespace IntrospectionActions {
    export const OK: AuthleteAPI.IntrospectionActions = "OK";
    export const BAD_REQUEST: AuthleteAPI.IntrospectionActions = "BAD_REQUEST";
    export const FORBIDDEN: AuthleteAPI.IntrospectionActions = "FORBIDDEN";
    export const UNAUTHORIZED: AuthleteAPI.IntrospectionActions = "UNAUTHORIZED";
    export const INTERNAL_SERVER_ERROR: AuthleteAPI.IntrospectionActions = "INTERNAL_SERVER_ERROR";
  }

  /**
   * actionのデータ型（/auth/authorization API）
   */
  export namespace AuthorizationActions {
    export const INTERNAL_SERVER_ERROR: AuthleteAPI.AuthorizationActions = "INTERNAL_SERVER_ERROR";
    export const BAD_REQUEST: AuthleteAPI.AuthorizationActions = "BAD_REQUEST";
    export const LOCATION: AuthleteAPI.AuthorizationActions = "LOCATION";
    export const FORM: AuthleteAPI.AuthorizationActions = "FORM";
    export const NO_INTERACTION: AuthleteAPI.AuthorizationActions = "NO_INTERACTION";
    export const INTERACTION: AuthleteAPI.AuthorizationActions = "INTERACTION";
  }

  /**
   * actionのデータ型（/auth/authorization/issue API）
   */
  export namespace AuthorizationIssueActions {
    export const INTERNAL_SERVER_ERROR: AuthleteAPI.AuthorizationIssueActions = "INTERNAL_SERVER_ERROR";
    export const BAD_REQUEST: AuthleteAPI.AuthorizationIssueActions = "BAD_REQUEST";
    export const LOCATION: AuthleteAPI.AuthorizationIssueActions = "LOCATION";
    export const FORM: AuthleteAPI.AuthorizationIssueActions = "FORM";
  }

  /**
   * アクセストークン発行APIのaction
   */
  export namespace TokenResponseActions {
    export const INVALID_CLIENT: AuthleteAPI.TokenResponseActions = "INVALID_CLIENT";
    export const INTERNAL_SERVER_ERROR: AuthleteAPI.TokenResponseActions = "INTERNAL_SERVER_ERROR";
    export const BAD_REQUEST: AuthleteAPI.TokenResponseActions = "BAD_REQUEST";
    export const PASSWORD: AuthleteAPI.TokenResponseActions = "PASSWORD";
    export const OK: AuthleteAPI.TokenResponseActions = "OK";
  }
}

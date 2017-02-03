import PolicyDocument from "./PolicyDocument";

/**
 * AuthorizeResponse
 * API Gatewayに返却するレスポンスオブジェクト
 *
 * @author keita-nishimoto
 * @since 2016-02-02
 */
export default class AuthorizeResponse {

  /**
   * constructor
   *
   * @param principalId
   * @param policyDocument
   */
  constructor(private _principalId: string, private _policyDocument: PolicyDocument) {
  }

  /**
   * @returns {string}
   */
  get principalId(): string {
    return this._principalId;
  }

  /**
   * @returns {PolicyDocument}
   */
  get policyDocument(): PolicyDocument {
    return this._policyDocument;
  }

  /**
   * レスポンスをObjectで取得する
   *
   * @returns {{principalId: string, policyDocument: {Version: string, Statement: [{Action: string, Effect: string, Resource: string[]}]}}}
   */
  toObject() {
    const firstStatement = this.policyDocument.getFirstStatement();
    const firstStatementObject = {
      Action: firstStatement.action,
      Effect: firstStatement.effect,
      Resource: firstStatement.resource
    };

    return {
      principalId: this.principalId,
      policyDocument: {
        Version: this.policyDocument.version,
        Statement: [firstStatementObject]
      }
    };
  }
}


import Statement from "./Statement";

/**
 * PolicyDocument
 * API Gatewayに返却するIAMポリシードキュメント
 *
 * @author keita-nishimoto
 * @since 2016-02-02
 * @link http://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/reference_policies_elements.html
 */
export default class PolicyDocument {

  /**
   * constructor
   *
   * @param version
   * @param statement
   */
  constructor(private _version: string, private _statement:[Statement]) {
  }

  /**
   * @returns {string}
   */
  get version(): string {
    return this._version;
  }

  /**
   * @returns {[Statement]}
   */
  get statement(): [Statement] {
    return this._statement;
  }

  /**
   * 最初のStatementをObjectを取得する
   *
   * @returns {Statement}
   */
  getFirstStatement(): Statement {
    const statement = this.statement;

    return statement[0];
  }
}

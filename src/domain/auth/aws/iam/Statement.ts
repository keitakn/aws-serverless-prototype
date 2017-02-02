/**
 * Statement
 * IAMポリシードキュメントのStatement属性
 *
 * @author keita-nishimoto
 * @since 2016-02-02
 * @link http://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/reference_policies_elements.html#Statement
 */
export default class Statement {

  /**
   * constructor
   *
   * @param action
   * @param effect
   * @param resource
   */
  constructor(private _action: string, private _effect: string, private _resource: [string]) {
  }

  /**
   * @returns {string}
   */
  get action(): string {
    return this._action;
  }

  /**
   * @returns {string}
   */
  get effect(): string {
    return this._effect;
  }

  /**
   * @returns {[string]}
   */
  get resource(): [string] {
    return this._resource;
  }
}

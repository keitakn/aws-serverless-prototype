import {Validator} from "jsonschema";
import {Schema} from "jsonschema";

/**
 * DomainValidator
 *
 * @author keita-nishimoto
 * @since 2017-03-07
 */
export class DomainValidator {

  /**
   * 実際にバリデーションを行うクラス
   */
  private _validator: Validator;

  /**
   * constructor
   * SchemeはJSON Schemeで渡す
   *
   * @param _scheme
   * @link http://json-schema.org/
   * @link https://spacetelescope.github.io/understanding-json-schema/index.html
   * @link http://qiita.com/dorachan1029/items/57b86116ae67e94ee1ff
   */
  constructor(private _scheme: Schema) {
    this._validator = new Validator();
  }

  /**
   * @returns {Validator}
   */
  get validator(): Validator {
    return this._validator;
  }

  /**
   * @returns {Schema}
   */
  get scheme(): Schema {
    return this._scheme;
  }

  /**
   * Validateを実行する
   * リクエストパラメータに問題がない場合は空のObjectを返す
   * リクエストパラメータに問題がある場合はエラーObjectを返す
   *
   * @param request
   * @returns {Object}
   */
  public doValidate(request: any): any {
    const validateResultObject: any = {};
    const validatorResult = this.validator.validate(request, this.scheme);
    if (validatorResult.errors.length === 0) {
      return validateResultObject;
    }

    validatorResult.errors.map((validationError) => {
      let key = "";
      if (validationError.property === "instance") {
        key = validationError.argument;
      } else {
        key = validationError.property.replace("instance.", "");
      }

      validateResultObject[key] = validationError.message;
    });

    return validateResultObject;
  }
}

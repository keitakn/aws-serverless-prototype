import {DomainValidator} from "../DomainValidator";

/**
 * AuthValidationService
 *s
 * @author keita-nishimoto
 * @since 2017-03-08
 */
export class AuthValidationService {

  /**
   * auth.issueAuthorizationCodeのバリデーション
   *
   * @param request
   * @returns {Object}
   */
  static issueAuthorizationCodeValidate(request: Object): Object {
    // TODO schemeはどこか別ファイル等に定義してまとめる
    const scheme = {
      type: "object",
      required: [
        "client_id",
        "state",
        "redirect_uri",
        "subject",
        "scopes"
      ],
      properties: {
        client_id: {
          "type": "number",
          "minimum": 1,
          "maximum": 9999999999999,
          "exclusiveMaximum": true
        },
        state: {
          "type": "string",
          "minLength": 8,
          "maxLength": 64
        },
        redirect_uri: {
          "type": "string",
          "format": "uri"
        },
        subject: {
          "type": "string",
          "minLength": 36,
          "maxLength": 36
        },
        scopes: {
          "type": "array",
          "items": {
            "type": "string",
            "minLength": 5,
            "maxLength": 32
          }
        }
      },
      additionalProperties: false
    };

    const domainValidator = new DomainValidator(scheme);

    let validateResultObject: any = {};
    const validatorResult = domainValidator.doValidate(request);
    if (validatorResult.errors.length === 0) {
      return validateResultObject;
    }

    validatorResult.errors.map((validationError) => {
      const key = validationError.property.replace("instance.", "");
      validateResultObject[key] = validationError.message;
    });

    return validateResultObject;
  }
}

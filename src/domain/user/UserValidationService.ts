import {DomainValidator} from "../DomainValidator";

/**
 * UserValidationService
 *
 * @author keita-nishimoto
 * @since 2017-03-14
 */
export class UserValidationService {

  /**
   * user.createのバリデーション
   *
   * @param request
   * @returns {Object}
   */
  public static createValidate(request: any): {[name: string]: string} {
    // TODO schemeはどこか別ファイル等に定義してまとめる
    const scheme = {
      type: "object",
      required: [
        "email",
        "password",
        "name",
        "gender",
        "birthdate",
      ],
      properties: {
        email: {
          type: "string",
          format: "email",
          maxLength: 128,
        },
        password: {
          type: "string",
          pattern: "^([a-zA-Z0-9])+$",
          minLength: 8,
          maxLength: 16,
        },
        name: {
          type: "string",
          minLength: 2,
          maxLength: 50,
        },
        gender: {
          type: "string",
          pattern: "^(male|female)+$",
          minLength: 4,
          maxLength: 6,
        },
        birthdate: {
          type: "string",
          pattern: "^([0-9]{4})([-]{1})([0-9]{2})([-]{1})([0-9]{2})+$",
          minLength: 10,
          maxLength: 10,
        },
      },
      additionalProperties: false,
    };

    const domainValidator = new DomainValidator(scheme);

    return domainValidator.doValidate(request);
  }

  /**
   * user.findのバリデーション
   *
   * @param request
   * @returns {Object}
   */
  public static findValidate(request: any): {[name: string]: string} {
    // TODO schemeはどこか別ファイル等に定義してまとめる
    const scheme = {
      type: "object",
      required: [
        "subject",
      ],
      properties: {
        subject: {
          type: "string",
          minLength: 36,
          maxLength: 36,
        },
      },
      additionalProperties: false,
    };

    const domainValidator = new DomainValidator(scheme);

    return domainValidator.doValidate(request);
  }
}

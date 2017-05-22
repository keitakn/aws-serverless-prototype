import {DomainValidator} from "../DomainValidator";

/**
 * AuthValidationService
 *
 * @author keita-nishimoto
 * @since 2017-03-08
 */
export class AuthValidationService {

  /**
   * auth.authenticationのバリデーション
   *
   * @param request
   * @returns {Object}
   */
  public static authenticationValidate(request: any): {[name: string]: string} {
    // TODO schemeはどこか別ファイル等に定義してまとめる
    const scheme = {
      type: "object",
      required: [
        "subject",
        "password",
      ],
      properties: {
        subject: {
          type: "string",
          minLength: 36,
          maxLength: 36,
        },
        password: {
          type: "string",
          pattern: "^([a-zA-Z0-9])+$",
          minLength: 8,
          maxLength: 16,
        },
      },
      additionalProperties: false,
    };

    const domainValidator = new DomainValidator(scheme);

    return domainValidator.doValidate(request);
  }

  /**
   * auth.issueAuthorizationCodeのバリデーション
   *
   * @param request
   * @returns {Object}
   */
  public static issueAuthorizationCodeValidate(request: any): {[name: string]: string} {
    // TODO schemeはどこか別ファイル等に定義してまとめる
    const scheme = {
      type: "object",
      required: [
        "client_id",
        "state",
        "redirect_uri",
        "subject",
        "scopes",
      ],
      properties: {
        client_id: {
          type: "number",
          minimum: 1,
          maximum: 9999999999999,
          exclusiveMaximum: true,
        },
        state: {
          type: "string",
          minLength: 8,
          maxLength: 64,
        },
        redirect_uri: {
          type: "string",
          format: "uri",
        },
        subject: {
          type: "string",
          minLength: 36,
          maxLength: 36,
        },
        scopes: {
          type: "array",
          items: {
            type: "string",
            minLength: 5,
            maxLength: 32,
          },
        },
      },
      additionalProperties: false,
    };

    const domainValidator = new DomainValidator(scheme);

    return domainValidator.doValidate(request);
  }
}

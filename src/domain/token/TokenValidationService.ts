import {DomainValidator} from "../DomainValidator";

/**
 * TokenValidationService
 *
 * @author keita-nishimoto
 * @since 2017-03-14
 */
export class TokenValidationService {

  /**
   * token.issueTokenFromCodeのバリデーション
   *
   * @param request
   * @returns {Object}
   */
  public static issueTokenFromCodeValidate(request: any): {[name: string]: string} {
    // TODO schemeはどこか別ファイル等に定義してまとめる
    const scheme = {
      type: "object",
      required: [
        "code",
        "redirect_uri",
      ],
      properties: {
        code: {
          type: "string",
          minLength: 43,
          maxLength: 43,
        },
        redirect_uri: {
          type: "string",
          format: "uri",
        },
      },
      additionalProperties: false,
    };

    const domainValidator = new DomainValidator(scheme);

    return domainValidator.doValidate(request);
  }
}

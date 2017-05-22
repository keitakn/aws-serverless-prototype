import {DomainValidator} from "../DomainValidator";

/**
 * ClientValidationService
 *
 * @author keita-nishimoto
 * @since 2017-03-13
 */
export class ClientValidationService {

  /**
   * client.findのバリデーション
   *
   * @param request
   * @returns {Object}
   */
  public static findValidate(request: any): {[name: string]: string} {
    // TODO schemeはどこか別ファイル等に定義してまとめる
    const scheme = {
      type: "object",
      required: [
        "client_id",
      ],
      properties: {
        client_id: {
          type: "number",
          minimum: 1,
          maximum: 9999999999999,
          exclusiveMaximum: true,
        },
      },
      additionalProperties: false,
    };

    const domainValidator = new DomainValidator(scheme);

    return domainValidator.doValidate(request);
  }
}

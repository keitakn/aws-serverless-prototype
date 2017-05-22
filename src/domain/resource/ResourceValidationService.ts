import {DomainValidator} from "../DomainValidator";

/**
 * ResourceValidationService
 *
 * @author keita-nishimoto
 * @since 2017-03-14
 */
export class ResourceValidationService {

  /**
   * resource.createのバリデーション
   *
   * @param request
   * @returns {Object}
   */
  public static createValidate(request: any): {[name: string]: string} {
    // TODO schemeはどこか別ファイル等に定義してまとめる
    const scheme = {
      type: "object",
      required: [
        "http_method",
        "resource_path",
        "name",
        "scopes",
      ],
      properties: {
        http_method: {
          type: "string",
          pattern: "^(GET|HEAD|POST|PUT|PATCH|DELETE|ANY)+$",
        },
        resource_path: {
          type: "string",
          pattern: "^([a-z/{}_-])+$",
          minLength: 2,
          maxLength: 50,
        },
        name: {
          type: "string",
          minLength: 2,
          maxLength: 50,
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

  /**
   * resource.findのバリデーション
   *
   * @param request
   * @returns {Object}
   */
  public static findValidate(request: any): {[name: string]: string} {
    // TODO schemeはどこか別ファイル等に定義してまとめる
    const scheme = {
      type: "object",
      required: [
        "resource_id",
      ],
      properties: {
        resource_id: {
          type: "string",
          pattern: "^(GET|HEAD|POST|PUT|PATCH|DELETE|ANY)([.]{1})([a-z{}._-])+$",
          minLength: 5,
          maxLength: 128,
        },
      },
      additionalProperties: false,
    };

    const domainValidator = new DomainValidator(scheme);

    return domainValidator.doValidate(request);
  }

  /**
   * resource.destroyのバリデーション
   *
   * @param request
   * @returns {Object}
   */
  public static destroyValidate(request: any): {[name: string]: string} {
    return ResourceValidationService.findValidate(request);
  }
}

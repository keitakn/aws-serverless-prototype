import {assert} from "chai";
import {ResourceValidationService} from "../../../../../domain/resource/ResourceValidationService";

/**
 * ResourceValidationService.createValidateのテスト
 */
describe("CreateValidate", () => {

  /**
   * バリデーションテスト
   * 必須パラメータが設定されていない
   */
  it("testValidationUnsetRequiredParams", () => {
    const request = {
      foo: "bar",
    };

    const validateResultObject = ResourceValidationService.createValidate(request);

    assert.property(
      validateResultObject,
      "http_method",
    );

    assert.property(
      validateResultObject,
      "resource_path",
    );

    assert.property(
      validateResultObject,
      "name",
    );

    assert.property(
      validateResultObject,
      "scopes",
    );

    // 許可していないキーが指定された場合もエラー情報としてレスポンスに含まれる
    assert.property(
      validateResultObject,
      "foo",
    );
  });

  /**
   * バリデーションテスト
   * パラメータの指定は行うが、各値にはバリデーションが通らない値を指定
   */
  it("testValidationSetParams", () => {
    const requests = [
      {
        // 許可されていないHTTPメソッドを設定
        http_method: "LINK",
        // 許可されている最小値より小さい値を指定
        resource_path: "t",
        // 許可されている最小値より小さい値を指定
        name: "N",
        // 許可されている最小値より小さい値を指定
        scopes: ["food"],
      },
      {
        // 許可されていないHTTPメソッドを設定
        http_method: "UNLINK",
        // 許可されている最大値より大きい値を指定
        resource_path: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        // 許可されている最大値より大きい値を指定
        name: "あああああああああああああああああああああああああああああああああああああああああああああああああああ",
        // 許可されている最大値より大きい値を指定
        scopes: ["98f46ad0-09e2-4324-910c-011df62e7"],
      },
      {
        // 許可されていないHTTPメソッドを設定
        http_method: "TRACE",
        // 許可されていない文字列を指定
        resource_path: "test/test.test",
        // 数値を指定
        name: 12345678,
        // 許可されている最大値より小さい値を指定
        scopes: ["98f46ad0-09e2-4324-910c-011df62e7"],
      },
      {
        // nullを指定
        http_method: null,
        resource_path: null,
        name: null,
        scopes: [null],
      },
      {
        // 空文字を指定
        http_method: "",
        resource_path: "",
        name: "",
        scopes: [""],
      },
    ];

    requests.map((request) => {
      const validateResultObject = ResourceValidationService.createValidate(request);

      assert.property(
        validateResultObject,
        "http_method",
      );

      assert.property(
        validateResultObject,
        "resource_path",
      );

      assert.property(
        validateResultObject,
        "name",
      );

      assert.property(
        validateResultObject,
        "scopes[0]",
      );
    });
  });

  /**
   * バリデーションテスト
   * バリデーションを通過するパラメータが含まれている場合はエラーから除外されている事を確認
   */
  it("testValidationNotContainsPartError", () => {
    const request = {
      http_method: "POST",
      resource_path: "tests/{id}",
      name: "クライアントの検索を行う",
      scopes: [null],
    };

    const validateResultObject = ResourceValidationService.createValidate(request);

    assert.notProperty(
      validateResultObject,
      "http_method",
    );

    assert.notProperty(
      validateResultObject,
      "resource_path",
    );

    assert.notProperty(
      validateResultObject,
      "name",
    );

    assert.property(
      validateResultObject,
      "scopes[0]",
    );
  });

  /**
   * バリデーションテスト
   * バリデーション結果にエラーが1つも含まれない場合
   */
  it("testValidationNotContainsError", () => {
    const request = {
      http_method: "DELETE",
      resource_path: "users/{user_id}/phone-numbers/{phone_number_id}",
      name: "名前",
      scopes: ["prototype_clients", "prototype_clients_find"],
    };

    const validateResultObject = ResourceValidationService.createValidate(request);

    // 空のオブジェクトである事はエラーが1つもない事を示す
    assert.equal(
      Object.keys(validateResultObject).length,
      0,
    );
  });
});

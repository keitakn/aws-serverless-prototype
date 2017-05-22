import {assert} from "chai";
import {ResourceValidationService} from "../../../../../domain/resource/ResourceValidationService";

/**
 * ResourceValidationService.findValidateのテスト
 */
describe("FindValidate", () => {

  /**
   * バリデーションテスト
   * 必須パラメータが設定されていない
   */
  it("testValidationUnsetRequiredParams", () => {
    const request = {
      foo: "bar",
    };

    const validateResultObject = ResourceValidationService.findValidate(request);

    assert.property(
      validateResultObject,
      "resource_id",
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
        // 許可されている最小値より小さい値を指定
        resource_id: "GET",
      },
      {
        // 許可されている最大値より大きい値を指定
        resource_id: "GET.",
      },
      {
        // HTTPメソッド部分に存在しない値を指定
        resource_id: "POS/tests",
      },
      {
        // 許可されていないHTTPメソッドを指定
        resource_id: "TRACE.users.{user_id}",
      },
      {
        // HTTPメソッド部分とリソースパス部分の区切り文字に.以外を指定
        resource_id: "GET-hosts",
      },
      {
        // リソースパス部分に/が含まれている
        resource_id: "GET.users/{user_id}",
      },
    ];

    requests.map((request) => {
      const validateResultObject = ResourceValidationService.findValidate(request);

      assert.property(
        validateResultObject,
        "resource_id",
      );
    });
  });

  /**
   * バリデーションテスト
   * バリデーション結果にエラーが1つも含まれない場合
   */
  it("testValidationNotContainsError", () => {

    const requests = [
      {
        resource_id: "GET.users.{user_id}.phone-numbers_{phone_number_id}",
      },
      {
        resource_id: "POST.users.{user_id}.phone-numbers",
      },
      {
        resource_id: "PUT.users.{user_id}.phone-numbers_{phone_number_id}",
      },
      {
        resource_id: "PATCH.users.{user_id}.phone-numbers_{phone_number_id}",
      },
      {
        resource_id: "DELETE.users.{user_id}.phone-numbers{phone_number_id}",
      },
      {
        resource_id: "ANY.users.{user_id}.phone-numbers_{phone_number_id}",
      },
    ];

    requests.map((request) => {
      const validateResultObject = ResourceValidationService.findValidate(request);

      // 空のオブジェクトである事はエラーが1つもない事を示す
      assert.equal(
        Object.keys(validateResultObject).length,
        0,
      );
    });
  });
});

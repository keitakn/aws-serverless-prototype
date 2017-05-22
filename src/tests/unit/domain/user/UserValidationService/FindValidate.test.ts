import {assert} from "chai";
import {UserValidationService} from "../../../../../domain/user/UserValidationService";

/**
 * UserValidationService.findValidateのテスト
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

    const validateResultObject = UserValidationService.findValidate(request);

    assert.property(
      validateResultObject,
      "subject",
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
        subject: "98f46ad0-09e2-4324-910c-011df62e730",
      },
      {
        // 許可されている最大値より大きい値を指定
        subject: "98f46ad0-09e2-4324-910c-011df62e73032",
      },
      {
        // nullを指定
        subject: null,
      },
      {
        // 空文字を指定
        subject: "",
      },
    ];

    requests.map((request) => {
      const validateResultObject = UserValidationService.findValidate(request);

      assert.property(
        validateResultObject,
        "subject",
      );
    });
  });

  /**
   * バリデーションテスト
   * バリデーション結果にエラーが1つも含まれない場合
   */
  it("testValidationNotContainsError", () => {
    const request = {
      subject: "98f46ad0-09e2-4324-910c-011df62e7307",
    };

    const validateResultObject = UserValidationService.findValidate(request);

    // 空のオブジェクトである事はエラーが1つもない事を示す
    assert.equal(
      Object.keys(validateResultObject).length,
      0,
    );
  });
});

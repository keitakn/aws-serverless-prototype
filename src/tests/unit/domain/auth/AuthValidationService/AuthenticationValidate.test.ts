import {assert} from "chai";
import {AuthValidationService} from "../../../../../domain/auth/AuthValidationService";

/**
 * AuthValidationService.authenticationValidateのテスト
 */
describe("AuthenticationValidate", () => {

  /**
   * バリデーションテスト
   * 必須パラメータが設定されていない
   */
  it("testValidationUnsetRequiredParams", () => {
    const request = {
      foo: "bar",
    };

    const validateResultObject = AuthValidationService.authenticationValidate(request);

    assert.property(
      validateResultObject,
      "subject",
    );

    assert.property(
      validateResultObject,
      "password",
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
        // 許可されている最小値より小さい値を指定
        password: "pass123",
      },
      {
        // 許可されている最大値より大きい値を指定
        subject: "98f46ad0-09e2-4324-910c-011df62e73032",
        // 許可されている最大値より大きい値を指定
        password: "pass1234567890123",
      },
      {
        // nullを指定
        subject: null,
        // 禁止されている文字列を含む
        password: "password@;",
      },
      {
        // 空文字を指定
        subject: "",
        password: "",
      },
    ];

    requests.map((request) => {
      const validateResultObject = AuthValidationService.authenticationValidate(request);

      assert.property(
        validateResultObject,
        "subject",
      );

      assert.property(
        validateResultObject,
        "password",
      );
    });
  });

  /**
   * バリデーションテスト
   * バリデーションを通過するパラメータが含まれている場合はエラーから除外されている事を確認
   */
  it("testValidationNotContainsPartError", () => {
    const request = {
      subject: "98f46ad0-09e2-4324-910c-011df62e7307",
      password: "pass",
    };

    const validateResultObject = AuthValidationService.authenticationValidate(request);

    assert.notProperty(
      validateResultObject,
      "subject",
    );

    assert.property(
      validateResultObject,
      "password",
    );
  });

  /**
   * バリデーションテスト
   * バリデーション結果にエラーが1つも含まれない場合
   */
  it("testValidationNotContainsError", () => {
    const request = {
      subject: "98f46ad0-09e2-4324-910c-011df62e7307",
      password: "passwordAB123456",
    };

    const validateResultObject = AuthValidationService.authenticationValidate(request);

    // 空のオブジェクトである事はエラーが1つもない事を示す
    assert.equal(
      Object.keys(validateResultObject).length,
      0,
    );
  });
});

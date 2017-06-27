import {assert} from "chai";
import {UserValidationService} from "../../../../../domain/user/UserValidationService";

/**
 * UserValidationService.createValidateのテスト
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

    const validateResultObject = UserValidationService.createValidate(request);

    assert.property(
      validateResultObject,
      "email",
    );

    assert.property(
      validateResultObject,
      "password",
    );

    assert.property(
      validateResultObject,
      "name",
    );

    assert.property(
      validateResultObject,
      "gender",
    );

    assert.property(
      validateResultObject,
      "birthdate",
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
        // 不正なメールアドレス形式
        email: "keita@",
        // 許可されている最小値より小さい値を指定
        password: "pass123",
        // 許可されている最小値より小さい値を指定
        name: "a",
        // フォーマット不正
        gender: "not known",
        // フォーマット不正
        birthdate: "1990/01/01",
      },
      {
        // 不正なメールアドレス形式
        email: ".keita@google.co.jp",
        // 許可されている最大値より大きい値を指定
        password: "pass1234567890123",
        // 許可されている最大値より大きい値を指定
        name: "あああああああああああああああああああああああああああああああああああああああああああああああああああ",
        // フォーマット不正
        gender: "not applicable",
        // フォーマット不正
        birthdate: "1990-1-1",
      },
      {
        // nullを指定
        email: null,
        // 禁止されている文字列を含む
        password: "password@;",
        // nullを指定
        name: null,
        gender: null,
        // フォーマット不正
        birthdate: "199-01/01",
      },
      {
        // 空文字を指定
        email: "",
        password: "",
        name: "",
        gender: "",
        // フォーマット不正
        birthdate: "1991-01-01 00:00:00",
      },
    ];

    requests.map((request) => {
      const validateResultObject = UserValidationService.createValidate(request);

      assert.property(
        validateResultObject,
        "email",
      );

      assert.property(
        validateResultObject,
        "password",
      );

      assert.property(
        validateResultObject,
        "name",
      );

      assert.property(
        validateResultObject,
        "gender",
      );

      assert.property(
        validateResultObject,
        "birthdate",
      );
    });
  });

  /**
   * バリデーションテスト
   * バリデーション結果にエラーが1つも含まれない場合
   */
  it("testValidationNotContainsError", () => {
    const request = {
      email: "keita@gmail.com",
      password: "password1234",
      name: "keita",
      gender: "male",
      birthdate: "1998-01-01",
    };

    const validateResultObject = UserValidationService.createValidate(request);

    // 空のオブジェクトである事はエラーが1つもない事を示す
    assert.equal(
      Object.keys(validateResultObject).length,
      0,
    );
  });
});

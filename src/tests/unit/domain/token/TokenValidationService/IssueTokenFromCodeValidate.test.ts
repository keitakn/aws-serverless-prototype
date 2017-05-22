import {assert} from "chai";
import {TokenValidationService} from "../../../../../domain/token/TokenValidationService";

/**
 * TokenValidationService.issueTokenFromCodeValidateのテスト
 */
describe("IssueTokenFromCodeValidate", () => {

  /**
   * バリデーションテスト
   * 必須パラメータが設定されていない
   */
  it("testValidationUnsetRequiredParams", () => {
    const request = {
      foo: "bar",
    };

    const validateResultObject = TokenValidationService.issueTokenFromCodeValidate(request);

    assert.property(
      validateResultObject,
      "code",
    );

    assert.property(
      validateResultObject,
      "redirect_uri",
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
        code: "CUQHYd7FAvWaz6ErRwcGRjk_LgJFUQpEyNW1jjW8yz",
        // 不正なURLフォーマットを指定
        redirect_uri: "http",
      },
      {
        // 許可されている最大値より大きい値を指定
        code: "CUQHYd7FAvWaz6ErRwcGRjk_LgJFUQpEyNW1jjW8yzo1",
        // 不正なURLフォーマットを指定
        redirect_uri: "https",
      },
      {
        // 数値を指定
        code: 1234567890123456789012345678901234567890123,
        // 数値を指定
        redirect_uri: 1234567890,
      },
      {
        // nullを指定
        code: null,
        redirect_uri: null,
      },
      {
        // 空文字を指定
        code: "",
        redirect_uri: "",
      },
    ];

    requests.map((request) => {
      const validateResultObject = TokenValidationService.issueTokenFromCodeValidate(request);

      assert.property(
        validateResultObject,
        "code",
      );

      assert.property(
        validateResultObject,
        "redirect_uri",
      );
    });
  });

  /**
   * バリデーションテスト
   * バリデーションを通過するパラメータが含まれている場合はエラーから除外されている事を確認
   */
  it("testValidationNotContainsPartError", () => {
    const request = {
      code: "CUQHYd7FAvWaz6ErRwcGRjk_LgJFUQpEyNW1jjW8yzo",
      redirect_uri: "http",
    };

    const validateResultObject = TokenValidationService.issueTokenFromCodeValidate(request);

    assert.notProperty(
      validateResultObject,
      "code",
    );

    assert.property(
      validateResultObject,
      "redirect_uri",
    );
  });

  /**
   * バリデーションテスト
   * バリデーション結果にエラーが1つも含まれない場合
   */
  it("testValidationNotContainsError", () => {
    const request = {
      code: "CUQHYd7FAvWaz6ErRwcGRjk_LgJFUQpEyNW1jjW8yzo",
      redirect_uri: "https://google.co.jp",
    };

    const validateResultObject = TokenValidationService.issueTokenFromCodeValidate(request);

    // 空のオブジェクトである事はエラーが1つもない事を示す
    assert.equal(
      Object.keys(validateResultObject).length,
      0,
    );
  });
});

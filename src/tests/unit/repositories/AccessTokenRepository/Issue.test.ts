import {AxiosPromise, AxiosRequestConfig} from "axios";
import {assert} from "chai";
import AccessTokenRepository from "../../../../repositories/AccessTokenRepository";
import {AuthleteAPIConstant} from "../../../../types/authlete/AuthleteAPIConstant";
import {TestUtil} from "../../../lib/TestUtil";

/**
 * AccessTokenRepository.issueのテスト
 */
describe("Issue", () => {

  /**
   * 正常系テスト
   * モックを使用
   */
  it("testSuccess", () => {
    const mockResponse = {
      accessToken: "9999999999AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      accessTokenDuration: 86400,
      accessTokenExpiresAt: 1490335510238,
      action: AuthleteAPIConstant.TokenResponseActions.OK,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    const mockAdapter = (requestConfig: AxiosRequestConfig): AxiosPromise => {
      return new Promise((resolve, reject) => {
        resolve({
          data: mockResponse,
          status: 200,
          statusText: "OK",
          headers,
          config: requestConfig,
        });
      });
    };

    const axiosInstance = TestUtil.createMockAxiosInstance(mockAdapter);
    const accessTokenRepository = new AccessTokenRepository(axiosInstance);

    return (async () => {
      // モックでリクエストを行っているので適当な値を設定すれば良い
      const accessTokenEntity = await accessTokenRepository.issue(
        "authorizationCode",
        "https://google.co.jp/oauth2/callback",
      );

      assert.equal(accessTokenEntity.accessToken, mockResponse.accessToken);
    })();
  });

  /**
   * 異常系テスト
   * 不適切なリクエスト
   */
  it("testFailBadRequest", () => {
    const mockResponse = {
      action: AuthleteAPIConstant.TokenResponseActions.BAD_REQUEST,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    const mockAdapter = (requestConfig: AxiosRequestConfig): AxiosPromise => {
      return new Promise((resolve, reject) => {
        resolve({
          data: mockResponse,
          status: 200,
          statusText: "OK",
          headers,
          config: requestConfig,
        });
      });
    };

    const axiosInstance = TestUtil.createMockAxiosInstance(mockAdapter);
    const accessTokenRepository = new AccessTokenRepository(axiosInstance);

    return (async () => {
      // モックでリクエストを行っているので適当な値を設定すれば良い
      await accessTokenRepository.issue(
        "authorizationCode",
        "https://google.co.jp/oauth2/callback",
      );

    })().catch((error) => {
      assert.equal(error.name, "BadRequestError");
    });
  });

  /**
   * 異常系テスト
   * 無効なクライアント
   */
  it("testFailInvalidClient", () => {
    const mockResponse = {
      action: AuthleteAPIConstant.TokenResponseActions.INVALID_CLIENT,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    const mockAdapter = (requestConfig: AxiosRequestConfig): AxiosPromise => {
      return new Promise((resolve, reject) => {
        resolve({
          data: mockResponse,
          status: 200,
          statusText: "OK",
          headers,
          config: requestConfig,
        });
      });
    };

    const axiosInstance = TestUtil.createMockAxiosInstance(mockAdapter);
    const accessTokenRepository = new AccessTokenRepository(axiosInstance);

    return (async () => {
      // モックでリクエストを行っているので適当な値を設定すれば良い
      await accessTokenRepository.issue(
        "authorizationCode",
        "https://google.co.jp/oauth2/callback",
      );

    })().catch((error) => {
      assert.equal(error.name, "BadRequestError");
    });
  });

  /**
   * 異常系テスト
   * サーバエラー（Authleteのサーバで何らかの問題が起きた場合）
   */
  it("testFailInternalServerError", () => {

    const headers = {
      "Content-Type": "application/json",
    };

    const mockAdapter = (requestConfig: AxiosRequestConfig): AxiosPromise => {
      return new Promise((resolve, reject) => {
        resolve({
          data: {message: "InternalServerError"},
          status: 500,
          statusText: "Internal Server Error",
          headers,
          config: requestConfig,
        });
      });
    };

    const axiosInstance = TestUtil.createMockAxiosInstance(mockAdapter);
    const accessTokenRepository = new AccessTokenRepository(axiosInstance);

    return (async () => {
      // モックでリクエストを行っているので適当な値を設定すれば良い
      await accessTokenRepository.issue(
        "authorizationCode",
        "https://google.co.jp/oauth2/callback",
      );

    })().catch((error) => {
      assert.equal(error.name, "InternalServerError");
    });
  });

  /**
   * 異常系テスト
   * ステータスコードは200だがresponse.actionにINTERNAL_SERVER_ERRORが設定されているケース
   */
  it("testFailActionInternalServerError", () => {
    const mockResponse = {
      action: AuthleteAPIConstant.TokenResponseActions.INTERNAL_SERVER_ERROR,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    const mockAdapter = (requestConfig: AxiosRequestConfig): AxiosPromise => {
      return new Promise((resolve, reject) => {
        resolve({
          data: mockResponse,
          status: 200,
          statusText: "OK",
          headers,
          config: requestConfig,
        });
      });
    };

    const axiosInstance = TestUtil.createMockAxiosInstance(mockAdapter);
    const accessTokenRepository = new AccessTokenRepository(axiosInstance);

    return (async () => {
      // モックでリクエストを行っているので適当な値を設定すれば良い
      await accessTokenRepository.issue(
        "authorizationCode",
        "https://google.co.jp/oauth2/callback",
      );

    })().catch((error) => {
      assert.equal(error.name, "InternalServerError");
    });
  });
});

import {assert} from "chai";
import {AuthApi} from "../../../lib/AuthApi";
import {ClientApi} from "../../../lib/ClientApi";
import {ResourceApi} from "../../../lib/ResourceApi";

/**
 * 認可のテスト
 *
 * このテストを成功させるには事前にAuthleteにクライアントIDの登録が必要です。
 */
describe("Authorization", () => {

  /**
   * 事後処理でテスト用に削除したリソースを再登録する
   */
  afterEach(() => {
    const createRequest: ResourceApi.CreateRequest = {
      http_method: "GET",
      resource_path: "clients",
      name: "Find Client.",
      scopes: ["prototype_clients"]
    };

    return ResourceApi.ApiClient.create(createRequest);
  });

  /**
   * 正常系のテストケース
   * クライアントクレデンシャルで発行したアクセストークンでAPIを呼び出せる事
   */
  it("testSuccessClientCredentials", () => {
    const tokenRequest: AuthApi.IssueAccessTokenInCheatApiRequest = {
      grantType: AuthApi.GrantTypesEnum.CLIENT_CREDENTIALS,
      clientId: 1957483863470,
      scopes: ["prototype_clients"]
    };

    return AuthApi.ApiClient.issueAccessTokenInCheatApi(tokenRequest).then((tokenCreateResponse) => {
      return ClientApi.ApiClient.find(tokenRequest.clientId, tokenCreateResponse.accessToken);
    }).then((response) => {
      assert.equal(response.status, 200);
      assert.equal(response.data.client_id, tokenRequest.clientId);
    });
  });

  /**
   * 正常系のテストケース
   * 認可コードで発行したアクセストークンでAPIを呼び出せる事
   */
  it("testSuccessAuthorizationCode", () => {
    const tokenRequest: AuthApi.IssueAccessTokenInCheatApiRequest = {
      grantType: AuthApi.GrantTypesEnum.AUTHORIZATION_CODE,
      clientId: 1957483863470,
      subject: "796c6536-5e55-4da6-adf1-9a6badfb2e3c",
      scopes: ["prototype_clients"]
    };

    return AuthApi.ApiClient.issueAccessTokenInCheatApi(tokenRequest).then((tokenCreateResponse) => {
      return ClientApi.ApiClient.find(tokenRequest.clientId, tokenCreateResponse.accessToken);
    }).then((response) => {
      assert.equal(response.status, 200);
      assert.equal(response.data.client_id, tokenRequest.clientId);
    });
  });

  /**
   * 正常系のテストケース
   * スコープを保持していないが、制限が存在しないので正常終了する
   */
  it("testSuccessScopeByLimitDoseNotExist", () => {
    // あえてアクセスに必要なスコープをリクエストしない
    const tokenRequest: AuthApi.IssueAccessTokenInCheatApiRequest = {
      grantType: AuthApi.GrantTypesEnum.AUTHORIZATION_CODE,
      clientId: 1957483863470,
      subject: "796c6536-5e55-4da6-adf1-9a6badfb2e3c",
      scopes: ["email"]
    };

    return (async () => {
      const tokenCreateResponse = await AuthApi.ApiClient.issueAccessTokenInCheatApi(tokenRequest);

      // DBからリソースを削除する
      await ResourceApi.ApiClient.destroy("GET_clients");

      return await ClientApi.ApiClient.find(tokenRequest.clientId, tokenCreateResponse.accessToken);
    })().then((response) => {
      assert.equal(response.status, 200);
      assert.equal(response.data.client_id, tokenRequest.clientId);
    });
  });
});

import {AxiosResponse} from "axios";
import {assert} from "chai";
import {ResourceRequest} from "../../../../domain/resource/request/ResourceRequest";
import {AuthleteAPIConstant} from "../../../../types/authlete/AuthleteAPIConstant";
import {AuthTest} from "../../../lib/AuthTest";
import {ClientTest} from "../../../lib/ClientTest";
import {ResourceTest} from "../../../lib/ResourceTest";

/**
 * 認可のテスト
 *
 * このテストを成功させるには事前にAuthleteにクライアントIDの登録が必要です。
 */
describe("Authorization", () => {

  // ローカル環境で通らないテストがあるのでスキップする為
  let itFunction: any = it;
  if (process.env.IS_LOCAL) {
    itFunction = it.skip;
  }

  /**
   * 事後処理でテスト用に削除したリソースを再登録する
   */
  afterEach(() => {
    const createRequest: ResourceRequest.CreateRequest = {
      http_method: "GET",
      resource_path: "clients",
      name: "Find Client.",
      scopes: ["prototype_clients", "prototype_clients_find"],
    };

    return ResourceTest.ApiClient.create(createRequest);
  });

  /**
   * 正常系のテストケース
   * クライアントクレデンシャルで発行したアクセストークンでAPIを呼び出せる事
   */
  it("testSuccessClientCredentials", () => {
    const tokenRequest: AuthTest.IssueAccessTokenInCheatApiRequest = {
      grantType: AuthleteAPIConstant.GrantTypes.CLIENT_CREDENTIALS,
      clientId: 1957483863470,
      scopes: ["prototype_clients"],
    };

    return AuthTest.ApiClient.issueAccessTokenInCheatApi(tokenRequest).then((tokenCreateResponse) => {
      return ClientTest.ApiClient.find(tokenRequest.clientId, tokenCreateResponse.accessToken);
    }).then((response: AxiosResponse) => {
      assert.equal(response.status, 200);
      assert.equal(response.data.client_id, tokenRequest.clientId);
    });
  });

  /**
   * 正常系のテストケース
   * 認可コードで発行したアクセストークンでAPIを呼び出せる事
   */
  it("testSuccessAuthorizationCode", () => {
    const tokenRequest: AuthTest.IssueAccessTokenInCheatApiRequest = {
      grantType: AuthleteAPIConstant.GrantTypes.AUTHORIZATION_CODE,
      clientId: 1957483863470,
      subject: "796c6536-5e55-4da6-adf1-9a6badfb2e3c",
      scopes: ["prototype_clients_find"],
    };

    return AuthTest.ApiClient.issueAccessTokenInCheatApi(tokenRequest).then((tokenCreateResponse) => {
      return ClientTest.ApiClient.find(tokenRequest.clientId, tokenCreateResponse.accessToken);
    }).then((response: AxiosResponse) => {
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
    const tokenRequest: AuthTest.IssueAccessTokenInCheatApiRequest = {
      grantType: AuthleteAPIConstant.GrantTypes.AUTHORIZATION_CODE,
      clientId: 1957483863470,
      subject: "796c6536-5e55-4da6-adf1-9a6badfb2e3c",
      scopes: ["email"],
    };

    return (async () => {
      const tokenCreateResponse = await AuthTest.ApiClient.issueAccessTokenInCheatApi(tokenRequest);

      // DBからリソースを削除する
      const destroyResourceResponse = await ResourceTest.ApiClient.destroy("GET.clients");
      assert.equal(destroyResourceResponse.status, 204);

      return await ClientTest.ApiClient.find(tokenRequest.clientId, tokenCreateResponse.accessToken);
    })().then((response: AxiosResponse) => {
      assert.equal(response.status, 200);
      assert.equal(response.data.client_id, tokenRequest.clientId);
    });
  });

  /**
   * 異常系テストケース
   * 存在しないアクセストークンを指定
   * Authlete Introspection APIからUnauthorizedが返ってくるパターン
   */
  itFunction("testFailAccessTokenDoseNotExist", () => {
    const clientId    = 1957483863470;
    const accessToken = "s8knBIweyLgtsSSexBhwLwQgo-BhKKLOo_v3l0uGX_Y";
    return ClientTest.ApiClient.find(clientId, accessToken).catch((error) => {
      assert.equal(error.response.status, 401);
    });
  });

  /**
   * 異常系テストケース
   * 認可に必要なスコープをアクセストークンが持っていないケース
   */
  itFunction("testFailNotHasRequiredScopes", () => {
    const tokenRequest: AuthTest.IssueAccessTokenInCheatApiRequest = {
      grantType: AuthleteAPIConstant.GrantTypes.AUTHORIZATION_CODE,
      clientId: 1957483863470,
      subject: "796c6536-5e55-4da6-adf1-9a6badfb2e3c",
      scopes: ["email"],
    };

    return (async () => {
      const tokenCreateResponse = await AuthTest.ApiClient.issueAccessTokenInCheatApi(tokenRequest);

      await ClientTest.ApiClient.find(tokenRequest.clientId, tokenCreateResponse.accessToken);
    })().catch((error) => {
      assert.equal(error.response.status, 403);
    });
  });
});

import {assert} from "chai";
import {AuthApi} from "../../../lib/AuthApi";
import AccessTokenRepository from "../../../../repositories/AccessTokenRepository";
import AccessTokenEntity from "../../../../domain/auth/AccessTokenEntity";
import {UserApi} from "../../../lib/UserApi";

/**
 * 認証のテスト
 */
describe("Authentication", () => {

  /**
   * テストに使うアクセストークン
   */
  let accessToken: string;

  /**
   * 事前にトークンを取得する
   */
  beforeEach((done: Function) => {
    const request: AuthApi.IssueAccessTokenInCheatApiRequest = {
      grantType: AuthApi.GrantTypesEnum.CLIENT_CREDENTIALS,
      clientId: 1957483863470,
      scopes: ["prototype_users", "prototype_clients"]
    };

    AuthApi.ApiClient.issueAccessTokenInCheatApi(request).then((response) => {
      const accessTokenRepository = new AccessTokenRepository();
      return accessTokenRepository.fetch(response.accessToken);
    }).then((accessTokenEntity: AccessTokenEntity) => {
      accessToken = accessTokenEntity.token;
      done();
    });
  });

  /**
   * 正常系のテストケース
   */
  it("testSuccess", (done: Function) => {
    const createUserRequest = {
      email: "keita@gmail.com",
      password: "password1234",
      name: "keita",
      gender: "male",
      birthdate: "1990-01-01"
    };

    UserApi.ApiClient
      .create(createUserRequest, accessToken)
      .then((response) => {
        const userId   = response.data.id;
        const password = createUserRequest.password;

        const request = {
          id: userId,
          password: password
        };

        return AuthApi.ApiClient.authentication(request);
      })
      .then((response) => {
        assert.equal(response.data.authenticated, true);
        done();
      });
  });
});

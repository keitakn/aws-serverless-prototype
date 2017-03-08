import {assert} from "chai";
import {ResourceApi} from "../../../lib/ResourceApi";

/**
 * リソース削除のテスト
 */
describe("DestroyResource", () => {

  /**
   * 事前にリソース登録を行っておく
   */
  beforeEach(() => {
    const request: ResourceApi.CreateRequest = {
      http_method: "POST",
      resource_path: "tests",
      name: "テストに利用するリソース",
      scopes: ["test"]
    };

    return ResourceApi.ApiClient.create(request).then(() => {});
  });

  /**
   * 正常系のテストケース
   */
  it("testSuccess", () => {
    const resourceId = "POST-tests";

    return ResourceApi.ApiClient.destroy(resourceId).then((response) => {
      assert.equal(response.status, 204);
    });
  });
});

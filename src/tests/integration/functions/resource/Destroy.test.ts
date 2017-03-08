import {assert} from "chai";
import {ResourceApi} from "../../../lib/ResourceApi";

/**
 * リソース削除のテスト
 */
describe("DestroyResource", () => {

  /**
   * 正常系のテストケース
   */
  it("testSuccess", () => {
    const request: ResourceApi.CreateRequest = {
      http_method: "POST",
      resource_path: "tests",
      name: "テストに利用するリソース",
      scopes: ["test"]
    };

    return ResourceApi.ApiClient.create(request).then((response) => {
      return response;
    }).then((response) => {
      const request: ResourceApi.DestroyRequest = {
        http_method: "POST",
        resource_path: "tests"
      };

      return ResourceApi.ApiClient.destroy(request);
    }).then((response) => {
      assert.equal(response.status, 204);
    });
  });
});

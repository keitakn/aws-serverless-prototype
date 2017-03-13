import {assert} from "chai";
import {ResourceApi} from "../../../lib/ResourceApi";

/**
 * リソース作成のテスト
 */
describe("CreateResource", () => {

  /**
   * 事前にテスト用のリソースを削除しておく
   */
  beforeEach(() => {
    const resourceId = "POST_tests";

    return (async () => {
      const destroyResponse = await ResourceApi.ApiClient.destroy(resourceId);
      assert.equal(destroyResponse.status, 204);
    })();
  });

  /**
   * 正常系のテストケース
   */
  it("testSuccessCreate", () => {
    const createRequest: ResourceRequest.CreateRequest = {
      http_method: "POST",
      resource_path: "tests",
      name: "テストに利用するリソース",
      scopes: ["test"]
    };

    return (async () => {
      const createResourceResponse = await ResourceApi.ApiClient.create(createRequest);

      assert.equal(createResourceResponse.status, 201);
      assert.equal(createResourceResponse.data.id, "POST/tests");
      assert.equal(createResourceResponse.data.http_method, createRequest.http_method);
      assert.equal(createResourceResponse.data.resource_path, createRequest.resource_path);
      assert.equal(createResourceResponse.data.name, createRequest.name);
      assert.deepEqual(createResourceResponse.data.scopes, createRequest.scopes);

      const findResourceResponse = await ResourceApi.ApiClient.find("POST_tests");
      assert.equal(findResourceResponse.status, 200);
    })();
  });
});

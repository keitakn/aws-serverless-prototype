import {assert} from "chai";
import {ResourceRequest} from "../../../../domain/resource/request/ResourceRequest";
import {ResourceTest} from "../../../lib/ResourceTest";

/**
 * リソース作成のテスト
 */
describe("CreateResource", () => {

  /**
   * 事前にテスト用のリソースを削除しておく
   */
  beforeEach(() => {
    const resourceId = "POST.tests";

    return (async () => {
      const destroyResponse = await ResourceTest.ApiClient.destroy(resourceId);
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
      scopes: ["tests"],
    };

    return (async () => {
      const createResourceResponse = await ResourceTest.ApiClient.create(createRequest);

      assert.equal(createResourceResponse.status, 201);
      assert.equal(createResourceResponse.data.resource_id, "POST/tests");
      assert.equal(createResourceResponse.data.http_method, createRequest.http_method);
      assert.equal(createResourceResponse.data.resource_path, createRequest.resource_path);
      assert.equal(createResourceResponse.data.name, createRequest.name);
      assert.deepEqual(createResourceResponse.data.scopes, createRequest.scopes);

      const findResourceResponse = await ResourceTest.ApiClient.find("POST.tests");
      assert.equal(findResourceResponse.status, 200);
    })();
  });

  /**
   * 異常系テスト
   * バリデーションエラー
   */
  it("testFailValidation", () => {
    const request: ResourceRequest.CreateRequest = {
      http_method: "TRACE",
      resource_path: "test/test.test/[1]",
      name: "",
      scopes: ["98f46ad0-09e2-4324-910c-011df62e7"],
    };

    return ResourceTest.ApiClient.create(request).catch((error) => {
      assert.equal(error.response.status, 422);
      assert.equal(error.response.data.code, 422);

      assert.property(
        error.response.data.errors,
        "http_method",
      );

      assert.property(
        error.response.data.errors,
        "resource_path",
      );

      assert.property(
        error.response.data.errors,
        "name",
      );

      assert.property(
        error.response.data.errors,
        "scopes[0]",
      );
    });
  });
});

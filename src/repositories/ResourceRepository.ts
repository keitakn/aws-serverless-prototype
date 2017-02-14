import {DynamoDB} from "aws-sdk";
import DocumentClient = DynamoDB.DocumentClient;
import {ResourceRepositoryInterface} from "../domain/resource/ResourceRepositoryInterface";
import {ResourceEntity} from "../domain/resource/ResourceEntity";

/**
 * ResourceRepository
 *
 * @author keita-nishimoto
 * @since 2016-02-14
 */
export class ResourceRepository implements ResourceRepositoryInterface {

  /**
   * constructor
   *
   * @param dynamoDbDocumentClient
   */
  constructor(private dynamoDbDocumentClient: DynamoDB.DocumentClient) {
  }

  /**
   * リソースを保存する
   *
   * @param resourceEntity
   * @returns {Promise<T>|Promise<TResult|T>}
   */
  save(resourceEntity: ResourceEntity): Promise<ResourceEntity> {

    const resourceCreateParams = {
      id: resourceEntity.id,
      http_method: resourceEntity.httpMethod,
      resource_path: resourceEntity.resourcePath,
      name: resourceEntity.name,
      scopes: resourceEntity.scopes,
      created_at: resourceEntity.createdAt,
      updated_at: resourceEntity.updatedAt
    };

    const params = {
      TableName: this.getResourcesTableName(),
      Item: resourceCreateParams
    };

    return this.dynamoDbDocumentClient
      .put(params)
      .promise()
      .then(() => {
        return resourceEntity;
      })
      .catch((error: Error) => {
        return error;
      });
  }

  /**
   * 実行環境のResourcesテーブル名を取得する
   *
   * @returns {string}
   */
  private getResourcesTableName() {
    return process.env.RESOURCES_TABLE_NAME;
  }
}

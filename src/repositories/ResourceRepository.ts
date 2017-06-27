import {DynamoDB} from "aws-sdk";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import {ResourceEntity} from "../domain/resource/ResourceEntity";
import {ResourceRepositoryInterface} from "../domain/resource/ResourceRepositoryInterface";
import InternalServerError from "../errors/InternalServerError";
import NotFoundError from "../errors/NotFoundError";
import {Logger} from "../infrastructures/Logger";
import GetItemOutput = DocumentClient.GetItemOutput;

/**
 * ResourceRepository
 *
 * @author keita-nishimoto
 * @since 2017-02-14
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
   * リソースを取得する
   *
   * @param resourceId
   * @returns {Promise<ResourceEntity.Entity>}
   */
  public find(resourceId: string): Promise<ResourceEntity.Entity> {
    return new Promise<ResourceEntity.Entity>((resolve, reject) => {
      const params = {
        TableName: this.getResourcesTableName(),
        Key: {
          id: resourceId,
        },
      };

      this.dynamoDbDocumentClient
        .get(params)
        .promise()
        .then((dbResponse: GetItemOutput) => {

          if (dbResponse.Item == null) {
            return reject(new NotFoundError());
          }

          const builder = new ResourceEntity.Builder();
          builder.resourceId   = dbResponse.Item["id"];
          builder.httpMethod   = dbResponse.Item["http_method"];
          builder.resourcePath = dbResponse.Item["resource_path"];
          builder.name         = dbResponse.Item["name"];
          builder.scopes       = dbResponse.Item["scopes"];
          builder.createdAt    = dbResponse.Item["created_at"];
          builder.updatedAt    = dbResponse.Item["updated_at"];

          const resourceEntity = builder.build();

          resolve(resourceEntity);
        })
        .catch((error: Error) => {
          Logger.critical(error);
          return reject(
            new InternalServerError(error.message),
          );
        });
    });
  }

  /**
   * リソースを保存する
   *
   * @param resourceEntity
   * @returns {Promise<ResourceEntity.Entity>}
   */
  public async save(resourceEntity: ResourceEntity.Entity): Promise<ResourceEntity.Entity> {
    try {
      const resourceCreateParams = {
        id: resourceEntity.resourceId,
        http_method: resourceEntity.httpMethod,
        resource_path: resourceEntity.resourcePath,
        name: resourceEntity.name,
        scopes: resourceEntity.scopes,
        created_at: resourceEntity.createdAt,
        updated_at: resourceEntity.updatedAt,
      };

      const params = {
        TableName: this.getResourcesTableName(),
        Item: resourceCreateParams,
      };

      await this.dynamoDbDocumentClient.put(params).promise();

      return resourceEntity;
    } catch (error) {
      Logger.critical(error);
      return Promise.reject(
        new InternalServerError(error.message),
      );
    }
  }

  /**
   * リソースを削除する
   *
   * @param resourceId
   * @returns {Promise<void>}
   */
  public async destroy(resourceId: string): Promise<void> {
    try {
      const params = {
        TableName: this.getResourcesTableName(),
        Key: {
          id: resourceId,
        },
      };

      await this.dynamoDbDocumentClient.delete(params).promise();

      return Promise.resolve();
    } catch (error) {
      Logger.critical(error);
      return Promise.reject(
        new InternalServerError(error.message),
      );
    }
  }

  /**
   * 実行環境のResourcesテーブル名を取得する
   *
   * @returns {string}
   */
  private getResourcesTableName(): string {
    const resourcesTableName = process.env.RESOURCES_TABLE_NAME;

    return typeof resourcesTableName === "string" ? resourcesTableName : "";
  }
}

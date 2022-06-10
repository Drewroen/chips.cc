import {
  BatchGetItemOutput,
  DocumentClient,
  GetItemOutput,
} from "aws-sdk/clients/dynamodb";

export class DynamoService {
  static async get(
    parameters: DynamoGetRequest,
    dynamoClient: DocumentClient
  ): Promise<GetItemOutput> {
    return new Promise((resolve, reject) => {
      dynamoClient.get(parameters, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  static async batchGet(
    parameters: any,
    dynamoClient: DocumentClient
  ): Promise<BatchGetItemOutput> {
    return new Promise((resolve, reject) => {
      dynamoClient.batchGet(parameters, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  static put(parameters: DynamoPutRequest, dynamoClient: DocumentClient) {
    return dynamoClient.put(parameters, function (err) {
      if (err) {
        throw new Error("Failed to put into dynamo");
      }
    });
  }

  static delete(parameters: DynamoDeleteRequest, dynamoClient: DocumentClient) {
    return dynamoClient.delete(parameters, function (err) {
      if (err) {
        throw new Error("Failed to delete from dynamo");
      }
    });
  }
}

export class DynamoGetRequest {
  public TableName: string;
  public Key: any;

  constructor(tableName: string, key: any) {
    this.TableName = tableName;
    this.Key = key;
  }
}

export class DynamoPutRequest {
  public TableName: string;
  public Item: any;

  constructor(tableName: string, item: any) {
    this.TableName = tableName;
    this.Item = item;
  }
}

export class DynamoDeleteRequest {
  public TableName: string;
  public Key: any;

  constructor(tableName: string, key: any) {
    this.TableName = tableName;
    this.Key = key;
  }
}
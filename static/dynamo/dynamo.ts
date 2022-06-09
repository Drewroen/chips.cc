import {
  BatchGetItemOutput,
  DocumentClient,
  GetItemOutput,
} from "aws-sdk/clients/dynamodb";
import {
  DynamoDeleteRequest,
  DynamoGetRequest,
  DynamoPutRequest,
} from "./objects/dynamoObjects";

export class Dynamo {
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

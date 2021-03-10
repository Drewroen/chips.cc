export class DynamoGetRequest
{
    public TableName: string;
    public Key: any;

    constructor(tableName: string, key: any)
    {
        this.TableName = tableName;
        this.Key = key;
    }
}

export class DynamoPutRequest
{
    public TableName: string;
    public Item: any;

    constructor(tableName: string, item: any)
    {
        this.TableName = tableName;
        this.Item = item;
    }
}

export class DynamoDeleteRequest
{
    public TableName: string;
    public Key: any;

    constructor(tableName: string, key: any)
    {
        this.TableName = tableName;
        this.Key = key;
    }
}
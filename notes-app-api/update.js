import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: "notes",
        // 'Key' defines the partition key and sort key of the item to be
        // updated
        // - 'userId': Identity Pool identity id of the authentitcated user
        // - 'noteId': path parameter
        Key: {
            userId: event.requestContext.identity.congitoIdentityId,
            noteId: event.pathParameters.id
        },
        // 'UpdateExpression' defines the attributes to be updated
        // 'ExpressionAttributeValues' defines the value in the update expression
        UpdateExpression: "SET content = :content, attachement = :attachment",
        ExpressionAttributeValues: {
            ":attachment": data.attachment || null,
            ":content": data.content || null
        },
        // 'ReturnValues' specifies if and how to return the item's attributes,
        // where ALL_NEW returns all attributes of the item after the update
        ReturnValue: "ALL_NEW"
    };

    try {
        await dynamoDbLib.call("update", params);
        return success({ status: true});
    } catch (e) {
        return failure({ status: false});
    }
}
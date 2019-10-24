import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import {success, failure} from "./libs/response-lib";

export async function main(event, context, callback) {
    // Event object contatins information from the invoker.
    // Body can be accessed from the event.body which is
    // JSON encoded string.
    let body = '';

    if (process.env.NODE_ENV == 'development')
        body = event.body;
    else
        body = JSON.parse(event.body);

    const params = {
        TableName: "notes",
        // 'Item' contains the attributes of the item to be created
        // - 'userId': user indentities are federated through the
        //              Cognito Identity Pool, we will use the identity
        //              id as the user id of the authenticated user
        // - 'noteId': a unique uuid
        // - 'content': pared from  request body
        // - 'attachment': parsed from request body
        // - 'createdAt': current Unix timestamp

        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            noteId: uuid.v1(),
            content: body.attachment,
            attachment: body.attachment,
            createdAt: Date.now()
        }
    };

    try {
        await dynamoDbLib.call("put", params);
        return success(params.Item);
    } catch (e) {
        return failure({ status: false });
    }

}
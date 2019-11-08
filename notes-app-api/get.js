import * as dynamoDb from "./libs/dynamodb-lib";
import { success, failure} from "./libs/response-lib";

export async function main(event, context) {
    const params = {
        TableName: "notes",
        // 'Key' defines the partition key and sort key of the item to be retrieved
        // - 'userId': Identity Pool identity id of the authenticated user
        // - 'noteId': path parameter
        Key: {
          userId: event.requestContext.identity.cognitoIdentityId,
          noteId: event.pathParameters.id
        }
    };

    try {
        const result = await dynamoDb.call("get", params);
        if (result.Item) {
            // Return the retrieved item if found
            return success(result.Item);
        } else {
            console.log("No record found for the the partition key: ", params.Key.userId,
             ' and sort key: ', params.Key.noteId);
            return failure( { status: false });
        }
    } catch (e) {
        console.log('Error ', e, ' occured while retrieving the data from dynamoDb.');
        return failure( { status: false } );
    }
}
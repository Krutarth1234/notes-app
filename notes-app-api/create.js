import uuid from "uuid";
import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export function main(event, context, callback) {
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

    dynamoDB.put(params, (error, data) => {
        // Set headers to enable CORS (Cross-Origin Resource Sharing)
        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        };

        // Return status code 500 or error
        if (error) {
            const response = {
                statusCode: 500,
                headers: headers,
                body: JSON.stringify({ status: false })
            };
            callback(null, response);
            return;
        }

        // Return status code 200 and the newly created item
        const response = {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(params.Item)
        };
        callback(null, response);
    });
}
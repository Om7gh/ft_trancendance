const userSchema = {
    type: "object",
    properties: {
        id: {type: "string", minLength: 10},
        name: {
            type: "string",
            minLength: 3,
            maxLength: 10,
            pattern: '^[a-zA-Z0-9_]+$'
        },
        photo_url: {type: "string"},
        connectionState: {type: "string", minLength: 5}
    },
    additionalProperties: false,
    required: ["id", "name", "photo_url", "connectionState"]
}

const messageActionSchema = {
    type: "object",
    properties: {
        action: {type: "string"},
        sender: userSchema,
        target: userSchema,
        content: {type: "string", minLength: 1}
    },
    additionalProperties: false,
    required: ["action", "sender", "target", "content"]
};

export default messageActionSchema;
const conversationActionSchema = {
    type: "object",
    properties: {
        action: {type: "string"},
        conversationId: {type: "integer", minimum: 1}
    },
    additionalProperties: false,
    required: ["action", "conversationId"]
};

export default conversationActionSchema;
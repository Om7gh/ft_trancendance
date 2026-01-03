const messageSchema = {
    type: "object",
    properties: {
        convId: {type: "integer", minimum: 1}
    },
    additionalProperties: false,
    required: ["convId"]
}

export default messageSchema;
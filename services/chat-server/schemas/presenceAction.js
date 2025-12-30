const presenceActionSchema = {
    type: "object",
    properties:{
        action: {type: "string"},
        users: {
            type: "array",
            uniqueItems: true,
            items: {
                type: "string",
                minLength: 10
            }
        }        
    },
    additionalProperties: false,
    required: ["action", "users"]
};

export default presenceActionSchema;
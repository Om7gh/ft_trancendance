const roomSchema = {
    type: "object",
    required: ["id", "state", "leftPlayer", "rightPlayer", "winner"],
    additionalProperties: false,

    $defs: {
        basePlayer: {
            type: "object",
            required: ["id", "username", "avatar", "points"],
            additionalProperties: false,
            properties: {
                id: { type: "string", minLength: 10 },
                username: { type: "string", minLength: 1 },
                avatar: { type: "string", minLength: 1 },
                points: { type: "number"}
            }
        }
    },

    properties: {
        id: { type: "string", minLength: 10},
        state: { type: "string", enum: ["done"]},
        leftPlayer: { $ref: "#/$defs/basePlayer" },
        rightPlayer: { $ref: "#/$defs/basePlayer" },
        winner: { $ref: "#/$defs/basePlayer" }
    }
};

export default roomSchema;

const blockeActionSchema = {
	type: "object",
	properties: {
		action: {type: "string"},
		targetId: {type: "string", minLength: 10}
	},
	additionalProperties: false,
	required: ["action", "targetId"]
};

export default blockeActionSchema;
const presenceActionSchema = {
	type: "object",
	properties:{
		action: {type: "string"},
		users: {
			type: "array",
			uniqueItems: true,
			items: {
				type: "string"
			}
		}
	},
	additionalProperties: false,
	required: ["action", "users"]
};

export default presenceActionSchema;
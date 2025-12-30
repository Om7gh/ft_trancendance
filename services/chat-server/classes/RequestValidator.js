import Ajv from "ajv";
import conversationActionSchema from "../schemas/conversationAction.js";
import messageActionSchema from "../schemas/messageAction.js";
import blockeActionSchema from "../schemas/blockAction.js";
import presenceActionSchema from "../schemas/presenceAction.js";

class RequestValidator{
	#ajvInstance;
	constructor(){
		this.#ajvInstance = new Ajv();
		try {
			this.#ajvInstance.addSchema(conversationActionSchema, "conversation-action");
			this.#ajvInstance.addSchema(messageActionSchema, "message-action");
			this.#ajvInstance.addSchema(blockeActionSchema, "block-action");
			this.#ajvInstance.addSchema(presenceActionSchema, "presence-action");
		}
		catch (error){
			console.log("Error happend while registring schema: ", error.message);
		}
	}

	isValidRequest(request, reqType){
		if (!this.#ajvInstance.validate(reqType, request)){
			console.log("Requset is not valid: ", this.#ajvInstance.errors);
			throw new Error("Bad Request. Check your input");
		}
	}
}

export default RequestValidator;
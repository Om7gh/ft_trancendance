const notificationSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "type", "sender", "receiver", "expireTime"],
  "additionalProperties": false,
  "properties": {
    "id": {
      "type": "string",
      "minLength": 10
    },
    "type": {
      "type": "string"
    },
    "sender": {
      "type": "object",
      "required": ["id", "username", "avatar"],
      "additionalProperties": false,
      "properties": {
        "id": {
          "type": "string",
          "minLength": 10
        },
        "username": {
          "type": "string"
        },
        "avatar": {
          "type": "string"
        }
      }
    },
    "receiver": {
      "type": "object",
      "required": ["id"],
      "additionalProperties": false,
      "properties": {
        "id": {
          "type": "string",
          "minLength": 10
        }
      }
    },
    "expireTime": {
      "type": "number",
    }
  }
}

export default notificationSchema;
const chessCustomizationSchema = {
  body : {
    "type": "object",
    "required": ["id", "chess_peice"],
    "additionalProperties": false,
    "properties": {
      "id": { 
        "type": "string", 
        "minLength": 10
      },
      "chess_peice": { 
        "type": "string", 
        "minLength": 10,
      }
    }
  }
}

export default chessCustomizationSchema;
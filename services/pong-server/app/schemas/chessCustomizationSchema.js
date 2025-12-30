const chessCustomizationSchema = {
  body : {
    "type": "object",
    "required": ["chess_piece"],
    "additionalProperties": false,
    "properties": {
      "chess_piece": { 
        "type": "string", 
        "minLength": 1
      }
    }
  }
}

export default chessCustomizationSchema;
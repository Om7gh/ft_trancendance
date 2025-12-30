const pongCustomizationSchema = {
  body : {
    "type": "object",
    "required": ["id", "ball_color", "left_paddle_color", "right_paddle_color", "table_edges_color"],
    "additionalProperties": false,
    "properties": {
      "id": { 
        "type": "string", 
        "minLength": 10
      },
      "ball_color": { 
        "type": "string", 
        "pattern": "^#[0-9A-Fa-f]{6}$",
      },
      "left_paddle_color": { 
        "type": "string", 
        "pattern": "^#[0-9A-Fa-f]{6}$",
      },
      "right_paddle_color": { 
        "type": "string", 
        "pattern": "^#[0-9A-Fa-f]{6}$",
      },
      "table_edges_color": { 
        "type": "string", 
        "pattern": "^#[0-9A-Fa-f]{6}$",
      }
    }
  }
}

export default pongCustomizationSchema;
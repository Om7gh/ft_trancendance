import pongCustomizationSchema from "../schemas/pongCustomizationSchema.js";
import chessCustomizationSchema from "../schemas/chessCustomizationSchema.js";

async function pongCustomizationUpdateHandler(request, reply) {
    const user  = request.user;
    const data  = request.body.data;
    const state = this.validateUser(user);

    if (!state) {
        const error = new Error("Invalid user passed to handler!!");
        error.type = "pongError";
        error.statusCode = 400;
        throw error;
    }

    this.db.insertPongCustomizations.run({
        id: user.id,
        ball_color: data.ball_color,
        left_paddle_color: data.left_paddle_color,
        right_paddle_color: data.right_paddle_color,
        table_edges_color: data.table_edges_color
    });

    return reply.send("updated successfully");
}

async function pongCustomizationFetchHandler(request, reply) {
    const user  = request.user;
    const state = this.validateUser(user);

    if (!state) {
        const error = new Error("Invalid user passed to handler!!");
        error.type = "pongError";
        error.statusCode = 400;
        throw error;
    }
    
    const customization = this.db.fetchPongCustomizations.get(user.id);

    return reply.send(customization);
}

async function chessCustomizationUpdateHandler(request, reply) {
    const user  = request.user;
    const data  = request.body;
    const state = this.validateUser(user);

    if (!state) {
        const error = new Error("Invalid user passed to handler!!");
        error.type = "pongError";
        error.statusCode = 400;
        throw error;
    }

    this.db.insertChessCustomizations.run({
        id: user.id,
        chess_piece: data.chess_piece
    });
    
    return reply.send("updated successfully");
}

async function chessCustomizationFetchHandler(request, reply) {
    const user  = request.user;
    const state = this.validateUser(user);

    if (!state) {
        const error = new Error("Invalid user passed to handler!!");
        error.type = "pongError";
        error.statusCode = 400;
        throw error;
    }
    
    const customization = this.db.fetchChessCustomizations.get(user.id);

    return reply.send(customization?.chess_piece ?? 'fantasy');
}

export default async function customization(fastify, options) {

    fastify.route({
        url     : '/pongGame/remote/pongCustomization/update',
        method  : 'PUT',
        schema  : pongCustomizationSchema,
        handler : pongCustomizationUpdateHandler,
    })

    fastify.route({
        url     : '/pongGame/remote/pongCustomization/fetch',
        method  : 'GET',
        handler : pongCustomizationFetchHandler,
    })

    fastify.route({
        url     : '/pongGame/remote/chessCustomization/update',
        method  : 'PUT',
        schema  : chessCustomizationSchema,
        handler : chessCustomizationUpdateHandler,
    })

    fastify.route({
        url     : '/pongGame/remote/chessCustomization/fetch',
        method  : 'GET',
        handler : chessCustomizationFetchHandler,
    })
}
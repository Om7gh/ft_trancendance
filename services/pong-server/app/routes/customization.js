import pongCustomizationSchema from "../schemas/pongCustomizationSchema.js";
import chessCustomizationSchema from "../schemas/chessCustomizationSchema.js";

async function pongCustomizationUpdateHandler(request, reply) {
    const user          = request.user;
    const data          = request.body;
    const state         = this.validateUser(user);

    if (!state) {
        const error = new Error("Invalid user passed to handler!!")
        error.statusCode = 400;
        throw error;
    }

    console.log("!!!!!!!!!!!!!", request.body, "!!!!!!!!!");

    this.db.insertPongCustomizations(data);

    return reply.send("updated successfully");
}

async function pongCustomizationFetchHandler(request, reply) {
    const user          = request.user;
    const data          = request.body;
    const state         = this.validateUser(user);

    if (!state) {
        const error = new Error("Invalid user passed to handler!!")
        error.statusCode = 400;
        throw error;
    }
    
    const customization = this.db.fetchPongCustomizations(data);

    console.log("@@@@@@@@@@", customization, "@@@@@@@@@@@");

    return reply.send(customization);
}

async function chessCustomizationUpdateHandler(request, reply) {
    const user          = request.user;
    const data          = request.body;
    const state         = this.validateUser(user);

    if (!state) {
        const error = new Error("Invalid user passed to handler!!")
        error.statusCode = 400;
        throw error;
    }

    console.log("!!!!!!!!!!!!!", request.body, "!!!!!!!!!");

    this.db.insertChessCustomizations(data);

    return reply.send("updated successfully");
}

async function chessCustomizationFetchHandler(request, reply) {
    const user          = request.user;
    const data          = request.body;
    const state         = this.validateUser(user);

    if (!state) {
        const error = new Error("Invalid user passed to handler!!")
        error.statusCode = 400;
        throw error;
    }
    
    const customization = this.db.fetchChessCustomizations(data);

    console.log("@@@@@@@@@@", customization, "@@@@@@@@@@@");

    return reply.send(customization);
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
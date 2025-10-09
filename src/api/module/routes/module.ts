export default {
    routes: [
        {
            method: 'GET',
            path: '/modules',
            handler: 'module.find',
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'GET',
            path: '/modules/:id',
            handler: 'module.findOne',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
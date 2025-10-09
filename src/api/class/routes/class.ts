/**
 * Class routes
 */

export default {
    routes: [
        {
            method: 'GET',
            path: '/classes',
            handler: 'class.find',
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'GET',
            path: '/classes/:id',
            handler: 'class.findOne',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
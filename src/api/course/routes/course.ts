/**
 * Course routes
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/courses',
      handler: 'course.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/courses/:id',
      handler: 'course.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/courses/category/:category',
      handler: 'course.findByCategory',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
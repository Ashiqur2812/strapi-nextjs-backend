export default {
    /**
     * Find courses based on user role
     */
    async find(ctx) {
        try {
            const user = ctx.state.user;

            if (!user) {
                return ctx.unauthorized('You must be logged in to view courses');
            }

            const userRole = user.role?.type || 'authenticated';

            // Sanitize query parameters
            const sanitizedQuery = await (this as any).sanitizeQuery(ctx);

            // Build query
            const query = {
                ...sanitizedQuery,
                populate: {
                    modules: {
                        populate: {
                            classes: true,
                        },
                    },
                },
            };

            // Fetch courses
            const { results, pagination } = await strapi.entityService.findPage(
                'api::course.course',
                query
            );

            // Role-based filter
            const filteredCourses = results.filter((course: any) => {
                const allowedRoles = course.allowedRoles || [];

                if (allowedRoles.includes(userRole)) return true;
                if (userRole === 'student' && allowedRoles.includes('student')) return true;
                return false;
            });

            const sanitizedResults = await (this as any).sanitizeOutput(filteredCourses, ctx);

            return {
                data: sanitizedResults,
                meta: { pagination },
            };
        } catch (error: any) {
            ctx.throw(500, `Error fetching courses: ${error.message}`);
        }
    },

    /**
     * Find single course by ID (role-based)
     */
    async findOne(ctx) {
        try {
            const { id } = ctx.params;
            const user = ctx.state.user;

            if (!user) {
                return ctx.unauthorized('You must be logged in to view this course');
            }

            const userRole = user.role?.type || 'authenticated';

            const course = await strapi.entityService.findOne('api::course.course', id, {
                populate: {
                    modules: {
                        populate: {
                            classes: true,
                        },
                    },
                },
            });

            if (!course) {
                return ctx.notFound('Course not found');
            }

            const allowedRoles = course.allowedRoles || [];
            if (!allowedRoles.includes(userRole)) {
                return ctx.forbidden('You do not have access to this course');
            }

            const sanitizedCourse = await (this as any).sanitizeOutput(course, ctx);
            return { data: sanitizedCourse };
        } catch (error: any) {
            ctx.throw(500, `Error fetching course: ${error.message}`);
        }
    },

    /**
     * Find courses by category
     */
    async findByCategory(ctx) {
        try {
            const { category } = ctx.params;
            const user = ctx.state.user;

            if (!user) {
                return ctx.unauthorized('You must be logged in');
            }

            const userRole = user.role?.type || 'authenticated';

            const courses = await strapi.entityService.findMany('api::course.course', {
                filters: { category },
                populate: {
                    modules: {
                        populate: {
                            classes: true,
                        },
                    },
                },
            });

            const filteredCourses = courses.filter((course: any) => {
                const allowedRoles = course.allowedRoles || [];
                return allowedRoles.includes(userRole);
            });

            const sanitizedResults = await (this as any).sanitizeOutput(filteredCourses, ctx);
            return { data: sanitizedResults };
        } catch (error: any) {
            ctx.throw(500, `Error fetching courses by category: ${error.message}`);
        }
    },
};

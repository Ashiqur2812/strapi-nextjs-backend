export default {
    /**
     * 🟢 Get all courses (role-based filtering)
     */
    async find(ctx: any) {
        try {
            const user = ctx.state?.user;
            const userRole = user?.role?.type || "public";

            // Fetch courses with modules and classes populated
            const courses = await strapi.entityService.findMany("api::course.course", {
                populate: {
                    modules: {
                        populate: {
                            classes: true,
                        },
                    },
                },
            });

            // Filter based on allowedRoles
            const filteredCourses = courses.filter((course: any) => {
                const allowedRoles: string[] = course.allowedRoles || [];
                return allowedRoles.includes(userRole) || allowedRoles.includes("all");
            });

            // Send response
            ctx.body = filteredCourses;
        } catch (error: any) {
            ctx.throw(500, `Error fetching courses: ${error.message}`);
        }
    },

    /**
     * 🟢 Get single course (role-based access)
     */
    async findOne(ctx: any) {
        try {
            const { id } = ctx.params;
            const user = ctx.state?.user;
            const userRole = user?.role?.type || "public";

            const course = await strapi.entityService.findOne("api::course.course", id, {
                populate: {
                    modules: {
                        populate: {
                            classes: true,
                        },
                    },
                },
            });

            if (!course) {
                return ctx.notFound("Course not found");
            }

            const allowedRoles: string[] = course.allowedRoles || [];
            if (!allowedRoles.includes(userRole) && !allowedRoles.includes("all")) {
                return ctx.forbidden("You do not have access to this course");
            }

            ctx.body = course;
        } catch (error: any) {
            ctx.throw(500, `Error fetching course: ${error.message}`);
        }
    },
};

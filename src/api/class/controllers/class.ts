export default {
    /**
     * 🔹 Find all classes
     */
    async find(ctx: any) {
        try {
            const user = ctx.state?.user;

            if (!user) {
                return ctx.unauthorized("You must be logged in");
            }

            // Sanitize query parameters
            const sanitizedQuery = await (this as any).sanitizeQuery(ctx);

            // Fetch paginated class list with module & course populated
            const { results, pagination } = await strapi.entityService.findPage(
                "api::class.class",
                {
                    ...sanitizedQuery,
                    populate: {
                        module: {
                            populate: {
                                course: true,
                            },
                        },
                    },
                }
            );

            // Sanitize the results
            const sanitizedResults = await (this as any).sanitizeOutput(results, ctx);

            return {
                data: sanitizedResults,
                meta: { pagination },
            };
        } catch (error: any) {
            ctx.throw(500, `Error fetching classes: ${error.message}`);
        }
    },

    /**
     * 🔹 Find one class by ID
     * Only students can access video URLs
     */
    async findOne(ctx: any) {
        try {
            const { id } = ctx.params;
            const user = ctx.state?.user;

            if (!user) {
                return ctx.unauthorized("You must be logged in");
            }

            const userRole = user.role?.type || "authenticated";

            // Fetch single class with module & course populated
            const classData = await strapi.entityService.findOne(
                "api::class.class",
                id,
                {
                    populate: {
                        module: {
                            populate: {
                                course: true,
                            },
                        },
                    },
                }
            );

            if (!classData) {
                return ctx.notFound("Class not found");
            }

            // Only students can access video URLs
            if (userRole !== "student" && classData.videoUrl) {
                delete classData.videoUrl;
            }

            const sanitizedClass = await (this as any).sanitizeOutput(classData, ctx);

            return { data: sanitizedClass };
        } catch (error: any) {
            ctx.throw(500, `Error fetching class: ${error.message}`);
        }
    },
};

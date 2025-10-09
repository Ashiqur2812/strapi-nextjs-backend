export default {
    /**
     * 🔹 Find modules with classes
     */
    async find(ctx: any) {
        try {
            const user = ctx.state?.user;

            if (!user) {
                return ctx.unauthorized('You must be logged in');
            }

            // Sanitize query (using Strapi helper)
            const sanitizedQuery = await (this as any).sanitizeQuery(ctx);

            // Fetch paginated modules
            const { results, pagination } = await strapi.entityService.findPage(
                'api::module.module',
                {
                    ...sanitizedQuery,
                    populate: {
                        classes: true,
                        course: true,
                    },
                }
            );

            // Sanitize output
            const sanitizedResults = await (this as any).sanitizeOutput(results, ctx);

            return {
                data: sanitizedResults,
                meta: { pagination },
            };
        } catch (error: any) {
            ctx.throw(500, `Error fetching modules: ${error.message}`);
        }
    },

    /**
     * 🔹 Find one module by ID
     */
    async findOne(ctx: any) {
        try {
            const { id } = ctx.params;
            const user = ctx.state?.user;

            if (!user) {
                return ctx.unauthorized('You must be logged in');
            }

            // Fetch single module with relations
            const module = await strapi.entityService.findOne(
                'api::module.module',
                id,
                {
                    populate: {
                        classes: true,
                        course: true,
                    },
                }
            );

            if (!module) {
                return ctx.notFound('Module not found');
            }

            // Sanitize response
            const sanitizedModule = await (this as any).sanitizeOutput(module, ctx);

            return { data: sanitizedModule };
        } catch (error: any) {
            ctx.throw(500, `Error fetching module: ${error.message}`);
        }
    },
};

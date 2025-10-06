import { factories } from "@strapi/strapi";
import type { Context } from "koa";

export default factories.createCoreController("api::course.course", ({ strapi }) => ({
    // ======================
    // Custom find() Method
    // ======================
    async find(ctx: Context) {
        const user = ctx.state?.user;
        const userRole = user?.role?.type || "public";

        // Sanitize query
        const sanitizedQueryParams = await (this as any).sanitizeQuery(ctx);

        // Fetch all courses with populated relations
        const entities = await strapi.entityService.findMany("api::course.course", {
            ...sanitizedQueryParams,
            populate: {
                modules: {
                    populate: {
                        classes: true,
                    },
                },
            },
        });

        // Filter courses based on allowedRoles
        const filteredEntities = entities.filter((course: any) => {
            const allowedRoles: string[] = course.allowedRoles || [];
            return allowedRoles.includes(userRole) || allowedRoles.includes("all");
        });

        // Sanitize and return response
        const sanitizedResults = await (this as any).sanitizeOutput(filteredEntities, ctx);
        return (this as any).transformResponse(sanitizedResults);
    },

    // ======================
    // Custom findOne() Method
    // ======================
    async findOne(ctx: Context) {
        const { id } = ctx.params;
        const user = ctx.state?.user;
        const userRole = user?.role?.type || "public";

        // Sanitize query
        const sanitizedQueryParams = await (this as any).sanitizeQuery(ctx);

        // Fetch single course with populated relations
        const entity = await strapi.entityService.findOne("api::course.course", id, {
            ...sanitizedQueryParams,
            populate: {
                modules: {
                    populate: {
                        classes: true,
                    },
                },
            },
        });

        if (!entity) {
            return ctx.notFound("Course not found");
        }

        // Check access permission
        const allowedRoles: string[] = entity.allowedRoles || [];
        if (!allowedRoles.includes(userRole) && !allowedRoles.includes("all")) {
            return ctx.forbidden("You do not have access to this course");
        }

        const sanitizedEntity = await (this as any).sanitizeOutput(entity, ctx);
        return (this as any).transformResponse(sanitizedEntity);
    },
}));

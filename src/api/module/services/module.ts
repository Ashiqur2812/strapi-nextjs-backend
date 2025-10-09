export default {
    /**
     * 🔹 Get modules by course ID
     */
    async findByCourse(courseId: number) {
        try {
            // Fetch all modules for a given course
            const modules = await strapi.entityService.findMany('api::module.module', {
                filters: {
                    course: {
                        id: courseId,
                    },
                },
                populate: {
                    classes: true,
                },
                sort: { order: 'asc' },
            });

            return modules;
        } catch (error: any) {
            throw new Error(`Error finding modules by course: ${error.message}`);
        }
    },
};

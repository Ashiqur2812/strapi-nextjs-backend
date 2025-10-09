export default {
    /**
     * 🔹 Get classes by module ID
     */
    async findByModule(moduleId: number) {
        try {
            const classes = await strapi.entityService.findMany("api::class.class", {
                filters: {
                    module: {
                        id: moduleId,
                    },
                },
                sort: { order: "asc" },
            });
            return classes;
        } catch (error: any) {
            throw new Error(`Error finding classes by module: ${error.message}`);
        }
    },
};

export default {
    /**
     * 🔹 Find courses accessible by a specific role
     */
    async findByRole(role: string) {
        try {
            const courses = await strapi.entityService.findMany('api::course.course', {
                filters: {
                    allowedRoles: {
                        $contains: role,
                    },
                },
                populate: {
                    modules: {
                        populate: {
                            classes: true,
                        },
                    },
                },
            });

            return courses;
        } catch (error: any) {
            throw new Error(`Error finding courses by role: ${error.message}`);
        }
    },

    /**
     * 🔹 Check if a user has access to a specific course
     */
    async hasAccess(courseId: number, userRole: string): Promise<boolean> {
        try {
            const course = await strapi.entityService.findOne(
                'api::course.course',
                courseId
            );

            if (!course) {
                return false;
            }

            const allowedRoles: string[] = course.allowedRoles || [];
            return allowedRoles.includes(userRole);
        } catch (error: any) {
            throw new Error(`Error checking course access: ${error.message}`);
        }
    },
};

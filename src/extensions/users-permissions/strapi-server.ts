
export default (plugin: any) => {
    // Extend the register controller
    plugin.controllers.auth.register = async (ctx: any) => {
        const { email, username, password, role } = ctx.request.body;

        // Validate input
        if (!email || !username || !password) {
            return ctx.badRequest("Missing required fields");
        }

        // Map custom roles to Strapi roles
        const roleMapping: Record<string, string> = {
            student: "authenticated",
            developer: "authenticated",
            "social-media-manager": "authenticated",
            "normal-user": "authenticated",
        };

        const strapiRole = roleMapping[role] || "authenticated";

        try {
            // Get the role
            const authenticatedRole = await strapi
                .query("plugin::users-permissions.role")
                .findOne({ where: { type: strapiRole } });

            if (!authenticatedRole) {
                return ctx.badRequest("Role not found");
            }

            // Create user
            const user = await strapi
                .plugin("users-permissions")
                .service("user")
                .add({
                    username,
                    email,
                    password,
                    role: authenticatedRole.id,
                    confirmed: true,
                    blocked: false,
                    customRole: role, // store custom role
                });

            // Generate JWT
            const jwt = strapi.plugin("users-permissions").service("jwt").issue({ id: user.id });

            return ctx.send({
                jwt,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role,
                },
            });
        } catch (error: any) {
            return ctx.badRequest(error.message);
        }
    };

    // Extend login callback to include custom role
    const originalCallback = plugin.controllers.auth.callback;
    plugin.controllers.auth.callback = async (ctx: any) => {
        const response = await originalCallback(ctx);

        if (response && response.user) {
            response.user.role = response.user.customRole || "normal-user";
        }

        return response;
    };

    return plugin;
};

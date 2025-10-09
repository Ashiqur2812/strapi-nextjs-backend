/**
 * Application entry point
 */

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register({ strapi }) {
    // Register custom functionality here
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  async bootstrap({ strapi }) {
    // Bootstrap your application here
    console.log('CPS Academy Backend is starting...');

    // Create default roles if they don't exist
    const roles = ['student', 'developer', 'social_media_manager'];

    for (const roleType of roles) {
      const existingRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: roleType } });

      if (!existingRole) {
        await strapi.query('plugin::users-permissions.role').create({
          data: {
            name: roleType.charAt(0).toUpperCase() + roleType.slice(1).replace('_', ' '),
            description: `${roleType} role`,
            type: roleType,
          },
        });
        console.log(`Created role: ${roleType}`);
      }
    }
    console.log('CPS Academy Backend started successfully!');
  },
};
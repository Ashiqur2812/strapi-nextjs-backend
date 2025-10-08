// export default {
//   /**
//    * Runs before your application is initialized.
//    */
//   register() { },

//   /**
//    * Runs before your application starts.
//    */
//   bootstrap() { },
// };

export default {
  /**
   * Register function runs before your application is initialized.
   */
  register({ strapi }: { strapi: any; }) {
    // Initialization logic here (optional)
  },

  /**
   * Bootstrap function runs before the app starts.
   */
  bootstrap({ strapi }: { strapi: any; }) {
    // Logic before app starts
  },
};


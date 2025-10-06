export default ({ env }: { env: (key: string, defaultValue?: any) => any }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: Boolean(env('FLAG_NPS', true)),
    promoteEE: Boolean(env('FLAG_PROMOTE_EE', true)),
  },
});

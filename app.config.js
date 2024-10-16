import { ConfigContext, createConfig } from '@expo/config';

export default ({ config }: ConfigContext) => ({
  ...config,
  extra: {
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    otherApiKey: process.env.OTHER_API_KEY || 'default_key',
  },
});

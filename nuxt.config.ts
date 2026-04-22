
console.log(import.meta.env);

export default defineNuxtConfig({

  compatibilityDate: 'latest',

  site: {
    url: 'https://khoshghadam.com',
    name: 'Khoshghadam',
  },

  nitro: {
    alias: Object.fromEntries(
      ['@aws-sdk/credential-providers', '@mongodb-js/zstd', 'kerberos', 'snappy', 'socks', 'gcp-metadata', 'mongodb-client-encryption'].map((dep) => [dep, 'unenv/mock/empty']),
    ),
  },

});

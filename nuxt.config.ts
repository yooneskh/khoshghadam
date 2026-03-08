

const mongodbOptionalDeps = [
  '@aws-sdk/credential-providers',
  '@mongodb-js/zstd',
  'kerberos',
  'snappy',
  'socks',
  'gcp-metadata',
  'mongodb-client-encryption',
]

export default defineNuxtConfig({

  compatibilityDate: 'latest',

  site: {
    url: 'https://khoshghadam.com',
    name: 'Khoshghadam',
  },

  nitro: {
    alias: Object.fromEntries(
      mongodbOptionalDeps.map((dep) => [dep, 'unenv/mock/empty']),
    ),
  },

});

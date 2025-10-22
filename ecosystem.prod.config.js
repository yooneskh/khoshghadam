module.exports = [
  {
    name: 'khoshghadam-frontend',
    cwd: './frontend/',
    script: 'mise',
    args: 'exec bun@1.3.0 -- bun run ./server/index.mjs',
    env: {
      NODE_ENV: 'production',
      PORT: 33500,
    },
  },
];

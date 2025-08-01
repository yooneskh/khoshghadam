module.exports = [
  {
    name: 'khoshghadam-frontend',
    cwd: './frontend/',
    script: 'bun',
    args: 'run ./server/index.mjs',
    env: {
      NODE_ENV: 'production',
      PORT: 33500,
    },
  },
];

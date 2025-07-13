module.exports = [
  {
    name: 'khoshghadam-frontend',
    cwd: './frontend/',
    script: 'bun',
    args: 'run ./server/index.mjs',
    env: {
      PORT: 48500,
    },
  },
];

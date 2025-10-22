module.exports = [
  {
    name: 'khoshghadam-frontend',
    cwd: './frontend/',
    script: 'mise',
    args: 'exec bun@1.3.0 -- bun serve',
    env: {
      NODE_ENV: 'development',
    },
  },
];

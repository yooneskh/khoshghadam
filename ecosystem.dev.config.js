module.exports = [
  {
    name: 'khoshghadam-frontend',
    cwd: './frontend/',
    script: 'mise',
    args: 'exec bun@1.3.3 -- bun serve',
    env: {
      NODE_ENV: 'development',
    },
  },
];

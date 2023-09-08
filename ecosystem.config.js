module.exports = {
  apps: [
    {
      name: 'gyanada-dev-backend',
      script: 'app.ts',
      interpreter: './node_modules/.bin/ts-node',
      watch: 'app.ts',
    },
  ],
};

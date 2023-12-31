module.exports = {
  apps: [
    {
      name: "gyanada-dev-backend",
      script: "app.ts",
      env: {
        PORT: 8002,
        SECRET_KEY: "shantanu-kumar",
        APP_ENV: 0,
        APP_LOCAL_PORT: 8080,
        APP_PROD_PORT: 9090,
        APP_IP: "192.168.229.134",
        DB_CONN:
          "mongodb://gyanada_sandbox_user:SandboxP%40%24%24w0rd%212%24Secure@ec2-13-232-230-93.ap-south-1.compute.amazonaws.com:27017/gyanada_sandbox",
      },
      interpreter: "./node_modules/.bin/ts-node",
      watch: "app.ts",
    },
  ],
};

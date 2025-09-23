module.exports = {
  apps: [
    {
      name: "email-frontend",
      script: "bun",
      args: "run preview",
      cwd: "/home/ubuntu/coding/email-marketing/email.marketing.tool.frontend",
      interpreter: "none",
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};

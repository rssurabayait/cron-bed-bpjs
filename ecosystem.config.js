module.exports = {
  apps: [{
    name: "aplicares-sync",
    script: "./src/app.js",
    watch: false,
    env: {
      NODE_ENV: "production",
    }
  }]
}
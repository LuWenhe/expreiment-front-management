// vue.config.js
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  chainWebpack: config => {
    // 路径配置
    config.resolve.alias
      .set('assets', resolve('src/assets'))
      .set('styles', resolve('src/assets/styles'))
  },
  // 其他配置....
  // webpack-dev-server 相关配置
  devServer: {
    // 调试端口
    port: 8083
  }
}

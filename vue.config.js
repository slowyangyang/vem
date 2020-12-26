const webpack = require('webpack')
const path = require('path')
module.exports = {
  publicPath: "./",
  assetsDir: "./static",
  configureWebpack: {
    externals: {
      'AMap': 'AMap'
    },
    plugins: [
      new webpack.ProvidePlugin({
          $:"jquery",
          jQuery:"jquery",
          "windows.jQuery":"jquery"
      })
    ],
    devServer: {//跨域配置
      proxy: {
        '/api':{
          target:'http://192.168.1.140:9002',
          changeOrigin: true,
          pathRewrite:{
            '^/api':''
          }
        }
      }
    },
    resolve: {
      alias: {
        'assets':"@/assets",
        'common':"@/common",
        'network':"@/network",
        'views':"@/views",
      }
    }
  }
}
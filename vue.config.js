const webpack = require('webpack')
module.exports = {
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
          target:'http://192.168.1.136:9002',
          changeOrigin: true,
          pathRewrite:{
            '^/api':''
          }
        }
      }
    },
    resolve: {
      alias: {
        'assect':"@/assect",
        'common':"@/common",
        'network':"@/network",
        'views':"@/views",
      }
    }
  }
}
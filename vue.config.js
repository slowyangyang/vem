const webpack = require('webpack')
const path = require('path')
module.exports = {
  publicPath: "./",
  assetsDir: "./static",
  productionSourceMap: false,//去掉.map
  configureWebpack: {//覆盖webpack配置
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
    resolve: {//路径别名
      alias: {
        'assets':"@/assets",
        'common':"@/common",
        'network':"@/network",
        'views':"@/views",
      }
    }
  }
}
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
 
const productionGzipExtensions = ['js', 'css'];
 
const env = process.env.NODE_ENV;
 
configureWebpack: (config) => {
  if (env == "production") {
    config.plugins.push(new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test: new RegExp(`\\.(${productionGzipExtensions.join('|')})$`),
      threshold: 10240,
      minRatio: 0.8,
    }));
    config.plugins.push(
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false,
            drop_debugger: true, // console
            drop_console: true,
            pure_funcs: ['console.log'] // 移除console
          },
        },
        sourceMap: false,
        parallel: true,
      }),
    );
  }
}
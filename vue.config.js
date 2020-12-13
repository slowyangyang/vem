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
    // devServer: {//跨域配置
			//     proxy: {
			// 			'/api':{
			// 				target:'https://api.apiopen.top',
			// 				changeOrigin: true,
			// 				pathRewrite:{
			// 					'^/api':'https://api.apiopen.top'
			// 				}
			// 			}
			// 		}
			//   }
  }
}
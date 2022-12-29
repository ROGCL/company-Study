// vue.config.js
const version = new Date().getTime();
module.exports = {
	publicPath: './',
	lintOnSave: false,
	devServer: {
		open: true,
		host: '0.0.0.0',
		port: 8888,
		https: false,
		proxy: {  //配置跨域
			[process.env.VUE_APP_PROXY_KEY]: {
				target: process.env.VUE_APP_PROXY,  //这里后台的地址模拟的;应该填写你们真实的后台接口
				ws: true,
				changOrigin: true,  //允许跨域
				pathRewrite: {
					[`^${process.env.VUE_APP_PROXY_KEY}`]: ''  //请求的时候使用这个api就可以
				}
			},
			'/supplement_order': {
				target:'https://ad.e.kuaishou.com/rest/openapi/gw/ad_social/v2/supplement_order/',
				changeOrigin:true, /* 在本地会创建一个虚拟服务端，然后发送请求的数据，
				并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题 */
				pathRewrite:{ 
				  '^/supplement_order': ''  
				}
			  }
		}
	},
	css: {

		// 是否使用css分离插件 ExtractTextPlugin
		extract: {
			// 修改打包后css文件名   // css打包文件，添加时间戳
			filename: `css/[name].${version}.css`,
			chunkFilename: `css/[name].${version}.css`
		}
	},

	configureWebpack: {
		output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
			filename: `[name].${'1.0.0'}.${version}.js`,
			chunkFilename: `[name].${'1.0.0'}.${version}.js`
		}
	}
}
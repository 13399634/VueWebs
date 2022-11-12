const path = require('path')
const {config} = require('@vue/cli-plugin-eslint/eslintOptions')
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
    //配置多页面入口
    pages: {
        // PixivImage: {
        //     entry: 'src/PixivImage/main.js',
        //     template: 'PixivImage.html',
        // },
        superLxLines2: {
            entry: 'src/superLxLines2/main.js',
            template: 'superLxLines2.html',
        },
    },
    // 输出路径
    outputDir: path.resolve(__dirname, '../src/webapp/vue/'),
    // css js 前缀
    publicPath: process.env.NODE_ENV === 'production' ? 'http://localhost:899/data2/' : '/',

    chainWebpack: config => {
        if (isProduction) {
            // console.log(config.plugins)
            // config
            //     .plugin('webpack-bundle-analyzer')
            //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin).end()
            config.plugins.delete('preload')
            config.plugins.delete('prefetch')
            config.plugins.delete('preload-PixivImage')
            config.plugins.delete('prefetch-PixivImage')
        }
    },

    configureWebpack: () => {
        let optimization = {
            splitChunks: {
                cacheGroups: {
                    commonjs: {
                        chunks: 'initial',
                        minChunks: 2,
                        maxInitialRequests: 5,
                        minSize: 0
                    },
                    vendor: {
                        test: /node_modules/,
                        chunks: 'initial',
                        name: 'vendor',
                        priority: 10,
                        enforce: true
                    }
                }
            },
            runtimeChunk: true,
        }
        Object.assign(config, {
            optimization
        })
    },

    devServer: {
        // open: true,
        // host: '0.0.0.0',
        // port: 8080,
        proxy: {
            // // superLxLines2
            // '/lib': {                             //设置拦截器  拦截器格式   斜杠+拦截器名字，名字可以自己定
            //     target: 'http://localhost:899',     //代理的目标地址(后端设置的端口号)
            //     changeOrigin: true,                 //是否设置同源，输入是的
            //     // ws: true,                        //支持 webSocket
            //     // pathRewrite: {                   //路径重写
            //     //   '^/lib': ''                    //选择忽略拦截器里面的单词
            //     // }
            //     /*也就是在前端使用/api可以直接替换为(http://localhost:899)*/
            // },
            '/style/superLxLines': {
                target: 'http://localhost:899',
                changeOrigin: true,
            },
            '/data/json': {
                target: 'http://localhost:899',
                changeOrigin: true,
            },
            '/data/ajax': {
                target: 'http://localhost:899',
                changeOrigin: true,
            },
            '/RePixivOrigin': {
                target: 'https://www.pixiv.net',
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    '^/RePixivOrigin': ''
                }
            },
            '/ReLocal899Origin': {
                target: 'http://localhost:899',
                changeOrigin: true,
                pathRewrite: {
                    '^/ReLocal899Origin': ''
                }
            },
            '/ipximgnet': {
                target: 'https://i.pximg.net',
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    '^/ipximgnet': ''
                },
                headers: {//header设置
                    referer: 'https://www.pixiv.net/',//referer
                    origin: 'https://www.pixiv.net/'
                }
            }
        }
    },
}

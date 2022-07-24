const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 打包生成的js文件自动加载index.html 文件中
const TestPlugin = require("./plugins/test-plugin");
const BannerWebpackPlugin = require("./plugins/banner-webpack-plugin");
const CleanWebpackPlugin = require("./plugins/clean-webpack-plugin");
const AnalyzeWebpackPlugin = require("./plugins/analyze-webpack-plugin");
const InlineChunkWebpackPlugin = require("./plugins/inline-chunk-webpack-plugin");

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: "js/[name].js",
        // clean: true,
    },
    module: {
        rules: [
            // {
            //     test:/\.js$/,
            //     use:[
            //         {
            //             loader:'./loader/test-loader.js'
            //         }
            //     ]
            // }
            {
                test: /\.js$/,
                // use:[
                //     // loader执行顺序，从下向上，从右向左执行,后执行的loader接收的content是上一个loader的的返回值，返回值不能为空
                //     // {
                //     //     loader:'./loader/demo/test-inline.js'
                //     // },
                //     // {
                //     //     loader:'./loader/demo/test-async.js'
                //     // }
                // ]
                // use:['./loader/demo/test-row.js']
                // use:['./loader/demo/pitching1.js','./loader/demo/pitching2.js','./loader/demo/pitching3.js']
                use: ['./loader/demo/clean-log-loader.js']

            },
            {
                test: /\.js$/,

                use: [{
                    loader: './loader/demo/banner-loader.js',
                    options: {
                        author: 'fengruibo'
                    }
                }]

            },
            {
                test: /\.js$/,

                use: [{
                    loader: './loader/demo/babel-loader/babel-loader.js',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }]

            },
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: "./loader/demo/file-loader.js",
                type: "javascript/auto", // 解决图片重复打包问题
            },
            {
                test: /\.css$/,
                // use:['style-loader','css-loader']
                // use:['./loader/demo/style-loader1.js','css-loader']
                use: ['./loader/demo/style-loader.js', 'css-loader']
            },

        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            // 以 public/index.html 为模板创建文件
            // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
            template: path.resolve(__dirname, "./public/index.html"),
        }),
        // new TestPlugin(),
        new BannerWebpackPlugin({
            author: "fengruibo",
        }),
        new CleanWebpackPlugin(),
        new AnalyzeWebpackPlugin(),
        new InlineChunkWebpackPlugin([/runtime(.*)\.js/]),
    ],
    optimization: {
        splitChunks: {
          chunks: "all",
        },
        runtimeChunk: {
          name: (entrypoint) => `runtime~${entrypoint.name}.js`,
        },
      },
    // mode: 'development'
    mode: "production",
}
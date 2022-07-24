const path = require('path')
const { DefinePlugin } = require("webpack")
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 打包生成的js文件自动加载index.html 文件中
const { VueLoaderPlugin } = require('vue-loader')
// 获取处理样式的Loaders
const getStyleLoaders = (preProcessor) => {
    return [
        "vue-style-loader",
        "css-loader",
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        "postcss-preset-env", // 能解决大多数样式兼容性问题
                    ],
                },
            },
        },
        preProcessor,
    ].filter(Boolean);
};
module.exports = {
    entry: './src/main.js',
    output: {
        path: undefined,
        filename: "static/js/[name].[contenthash:8].js", // 入口文件打包输出资源命名方式
        chunkFilename: "static/js/[name].[contenthash:8].chunk.js", // 动态导入输出资源命名方式
        assetModuleFilename: "static/media/[name].[hash][ext]", // 图片、字体等资源命名方式（注意用hash）
    },
    module: {
        rules: [
            {
                test: /\.css$/,// 用来匹配 .css 结尾的文件
                use: getStyleLoaders()
                // use: [ // use 数组里面 Loader 执行顺序是从右到左
                //     MiniCssExtractPlugin.loader, // 将js中css通过创建style标签的形式添加到html标签中
                //     {
                //         loader: 'css-loader',// 将css资源编译commonjs的模块到js中
                //         // options: {
                //         //     modules: true
                //         // }
                //     },
                //     {
                //         loader: "postcss-loader",// 解决兼容css问题，需要放在css-loader建在之前,还需要在package.json中进行配置browserslint,指定兼容性做到什么程度
                //         options: {
                //             postcssOptions: {
                //                 plugins: [
                //                     "postcss-preset-env", // 能解决大多数样式兼容性问题
                //                 ],
                //             },
                //         },
                //     },
                // ]
            },
            {
                test: /\.less$/,// 用来匹配 .css 结尾的文件
                use: getStyleLoaders('less-loader')
            },
            {
                test: /\.s[ac]ss$/,// 用来匹配 .css 结尾的文件
                use: getStyleLoaders('sass-loader')
            },
            {
                test: /\.styl$/,// 用来匹配 .css 结尾的文件
                use: getStyleLoaders('stylus-loader')
            },
            // 处理图片
            {
                test: /\.(png|jpe?g|gif|webp)$/,
                type: "asset", // webpack5内置模块 会转成base64
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024 // // 小于10kb的图片会被base64处理
                    }
                },
                generator: {
                    // 将图片文件输出到 static/imgs 目录中
                    // 将图片文件命名 [hash:8][ext][query]
                    // [hash:8]: hash值取8位
                    // [ext]: 使用之前的文件扩展名
                    // [query]: 添加之前的query参数
                    filename: "static/imags/[hash:8][ext][query]",
                },
            },
            {
                test: /\.(ttf|woff2?|mp3|mp4|avi)$/, // 处理字体图标或媒体资源
                type: "asset/resource", // 资源模块，不需要转成base64
                generator: {
                    filename: "static/media/[hash:8][ext][query]",
                },
            },
            {
                test: /\.js$/,
                include: path.resolve(__dirname, "../src"),
                use: [
                    // {
                    //     loader: "thread-loader",
                    //     options: {
                    //         work: threads,// 进程数量
                    //     },
                    // },
                    {
                        loader: "babel-loader", // 需要配合使用babel.config.js使用
                        options: {
                            cacheDirectory: true, // 开启babel编译缓存
                            cacheCompression: false, // 缓存文件不要压缩

                        },
                    }
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [
        new ESLintWebpackPlugin({
            context: path.resolve(__dirname, "../src"), // 处理入口
            exclude: "node_modules",// 默认值排除不处理范围
            cache: true,//设置缓存
            // 缓存目录
            cacheLocation: path.resolve(
                __dirname,
                "../node_modules/.cache/.eslintcache"
            ),
        }),
        new HtmlWebpackPlugin({
            // 以 public/index.html 为模板创建文件
            // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
            template: path.resolve(__dirname, "../public/index.html"),
        }),
        // 请确保引入这个插件！
        new VueLoaderPlugin(),
        
        // cross-env定义的环境变量是给webpack使用的
        // DefinePlugin定义的环境变量是给源代码是用的// 解决vue页面警告
        new DefinePlugin({
            __VUE_OPTIONS_API__: "true",
            __VUE_PROD_DEVTOOLS__: "false",
        }),

    ],
    optimization: {
        // webpack5一般存放压缩位置
        // 代码分割配置
        splitChunks: {
            chunks: "all", // 对所有模块都进行分割
            // 其他内容用默认配置即可
        },
        // 提取runtime文件
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`, // runtime文件命名规则
        },
    },
    // webpack解析模块选项
    resolve: {
        // 自动补全文件扩展名
        extensions: [".vue", ".js", ".json"],
    },
    // 开发服务器
    devServer: {
        host: "localhost", // 启动服务器域名
        port: "4000", // 启动服务器端口号
        open: true, // 是否自动打开浏览器
        hot: true, // 开启HMR功能（只能用于开发环境，生产环境不需要了）
        historyApiFallback: true, // 解决react-router刷新404问题
    },
    // 模式 开发模式：development 生产模式：production
    mode: "development",
    devtool: "cheap-module-source-map",
}
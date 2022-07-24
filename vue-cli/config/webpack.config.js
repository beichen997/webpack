const path = require('path')
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 打包生成的js文件自动加载index.html 文件中
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//提取css成单独文件
// const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin'); //热更新模块
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin"); // js压缩
const CopyPlugin = require("copy-webpack-plugin");//复制public资源，用于加载index.html自定义加载内容
const { VueLoaderPlugin } = require('vue-loader')
const { DefinePlugin } = require("webpack")
// 按需加载
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
// 需要通过 cross-env 定义环境变量
const isProduction = process.env.NODE_ENV === "production";
// 获取处理样式的Loaders
const getStyleLoaders = (preProcessor) => {
    return [
        isProduction ? MiniCssExtractPlugin.loader : "vue-style-loader",
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
        preProcessor && {
            loader: preProcessor,
            options: preProcessor === "sass-loader" ? {
                additionalData: `@use "@/styles/element/index.scss" as *;`
            } : {}
        },
    ].filter(Boolean);
};
module.exports = {
    entry: './src/main.js',
    output: {
        path: isProduction ? path.resolve(__dirname, '../dist') : undefined,
        filename: isProduction ? "static/js/[name].[contenthash:8].js" : "static/js/[name].js", // 入口文件打包输出资源命名方式
        chunkFilename: isProduction ? "static/js/[name].[contenthash:8].chunk.js" : "static/js/[name].chunk.js", // 动态导入输出资源命名方式
        assetModuleFilename: isProduction ? "static/media/[name].[hash][ext]" : "static/media/[name].[ext]", // 图片、字体等资源命名方式（注意用hash）
        clean: true,
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
        // 提取css成单独文件
        isProduction && new MiniCssExtractPlugin({
            // 定义输出文件名和目录
            // filename: "static/css/[name].css",
            // chunkFilename:"static/css/[name].chunk.css", // 区分主文件，动态导入css文件
            // 定义输出文件名和目录
            filename: "static/css/[name].[contenthash:8].css",
            chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
        }),
        // 将public下面的资源复制到dist目录去（除了index.html）
        isProduction && new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "../public"),
                    to: path.resolve(__dirname, "../dist"),
                    toType: "dir",
                    noErrorOnMissing: true, // 不生成错误
                    globOptions: {
                        // 忽略文件index.html，防止生成2个index.html
                        ignore: ["**/index.html"],
                    },
                    info: {
                        // 跳过terser压缩js
                        minimized: true,
                    },
                },
            ],
        }),
        // !isProduction && new ReactRefreshWebpackPlugin(),// react 热更新模块
        // 请确保引入这个插件！
        new VueLoaderPlugin(),

        // cross-env定义的环境变量是给webpack使用的
        // DefinePlugin定义的环境变量是给源代码是用的// 解决vue页面警告
        new DefinePlugin({
            __VUE_OPTIONS_API__: "true",
            __VUE_PROD_DEVTOOLS__: "false",
        }),
        AutoImport({
            //按需加载
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver(
                // 自定义主题配置
                {importStyle: "sass",}),
            ],
        }),


    ].filter(Boolean),
    optimization: {
        // webpack5一般存放压缩位置
        minimize: isProduction ? true : false,//控制是否需要压缩
        minimizer: [
            // css压缩也可以写到optimization.minimizer里面，效果一样的
            new CssMinimizerPlugin(),
            new TerserWebpackPlugin()
        ],
        // 代码分割配置
        splitChunks: {
            chunks: "all", // 对所有模块都进行分割
            // 其他内容用默认配置即可
            cacheGroups: {
                // layouts通常是admin项目的主体布局组件，所有路由组件都要使用的
                // 可以单独打包，从而复用
                // 如果项目中没有，请删除
                layouts: {
                    name: "layouts",
                    test: path.resolve(__dirname, "../src/layouts"),
                    priority: 40,
                },
                // 如果项目中使用antd，此时将所有node_modules打包在一起，那么打包输出文件会比较大。
                // 所以我们将node_modules中比较大的模块单独打包，从而并行加载速度更好
                // 如果项目中没有，请删除
                // priority权重控制优先级
                elementPlus: {
                    name: "chunk-elementPlus",
                    test: /[\\/]node_modules[\\/]element-plus(.*)/,
                    priority: 30,
                },
                // 将react相关的库单独打包，减少node_modules的chunk体积。
                vue: {
                    name: "vue",
                    test: /[\\/]node_modules[\\/]vue(.*)?[\\/]/,
                    chunks: "initial",
                    priority: 20,
                },
                libs: {
                    name: "chunk-libs",
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10, // 权重最低，优先考虑前面内容
                    chunks: "initial",
                },
            },
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
        alias: {
            // 路径别名
            "@": path.resolve(__dirname, "../src"),
        },
    },
    // 模式 开发模式：development 生产模式：production
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? "source-map" : "cheap-module-source-map",
    // 开发服务器
    devServer: {
        host: "localhost", // 启动服务器域名
        port: "3000", // 启动服务器端口号
        open: true, // 是否自动打开浏览器
        hot: true, // 开启HMR功能（只能用于开发环境，生产环境不需要了）
        historyApiFallback: true, // 解决react-router刷新404问题
    },
    performance: false, // 关闭性能分析，提示速度
}
const path = require('path')
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 打包生成的js文件自动加载index.html 文件中
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//提取css成单独文件
// const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin'); //热更新模块
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin"); // js压缩
const CopyPlugin = require("copy-webpack-plugin");//复制public资源，用于加载index.html自定义加载内容
// 获取处理样式的Loaders
const getStyleLoaders = (preProcessor) => {
    return [
        MiniCssExtractPlugin.loader,
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
        path: path.resolve(__dirname, '../dist'),
        filename: "static/js/[name].[contenthash:8].js", // 入口文件打包输出资源命名方式
        chunkFilename: "static/js/[name].[contenthash:8].chunk.js", // 动态导入输出资源命名方式
        assetModuleFilename: "static/media/[name].[hash][ext]", // 图片、字体等资源命名方式（注意用hash）
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
                test: /\.(jsx|js)$/,
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
        new MiniCssExtractPlugin({
            // 定义输出文件名和目录
            // filename: "static/css/[name].css",
            // chunkFilename:"static/css/[name].chunk.css", // 区分主文件，动态导入css文件
            // 定义输出文件名和目录
            filename: "static/css/[name].[contenthash:8].css",
            chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
        }),
        // 将public下面的资源复制到dist目录去（除了index.html）
        new CopyPlugin({
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

    ],
    optimization: {
        // webpack5一般存放压缩位置
        // webpack5一般存放压缩位置
        minimize: true,
        minimizer: [
            // css压缩也可以写到optimization.minimizer里面，效果一样的
            new CssMinimizerPlugin(),
            new TerserWebpackPlugin()
        ],
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
        extensions: [".jsx", ".js", ".json"],
    },
    // 模式 开发模式：development 生产模式：production
    mode: "production",
    devtool: "source-map",
}
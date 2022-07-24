const path = require('path')
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 打包生成的js文件自动加载index.html 文件中
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin"); // 无损压缩
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
// nodejs核心模块，直接使用
const os = require("os");
// 内置
const TerserPlugin = require("terser-webpack-plugin");
// cpu核数
const threads = os.cpus().length;

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
    // 入口
    entry: "./src/main.js",
    // 输出
    output: {
        // path: 文件输出目录，必须是绝对路径
        // path.resolve()方法返回一个绝对路径
        // __dirname 当前文件的文件夹绝对路径
        path: path.resolve(__dirname, "../dist"),
        // filename: 输出文件名
        // filename: "static/js/[name].js",

        clean: true, // 在打包前自动清空path目录
        // // 给打包输出的其他文件命名
        // chunkFilename: "static/js/[name].chunk.js",
        // assetModuleFilename: "static/media/[name].[hash][ext]", // 图片、字体等资源命名方式（注意用hash）
        // [contenthash:8]使用contenthash，取8位长度
        filename: "static/js/[name].[contenthash:8].js", // 入口文件打包输出资源命名方式
        chunkFilename: "static/js/[name].[contenthash:8].chunk.js", // 动态导入输出资源命名方式
        assetModuleFilename: "static/media/[name].[hash][ext]", // 图片、字体等资源命名方式（注意用hash）
    },
    // 加载器
    module: {
        rules: [
            {
                oneOf: [ // 每个文件只能被一个loader配置处理,不用遍历所有loader,提高速率
                    {
                        test: /\.css$/,// 用来匹配 .css 结尾的文件
                        use: [ // use 数组里面 Loader 执行顺序是从右到左
                            MiniCssExtractPlugin.loader, // 将js中css通过创建style标签的形式添加到html标签中
                            {
                                loader: 'css-loader',// 将css资源编译commonjs的模块到js中
                                // options: {
                                //     modules: true
                                // }
                            },
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
                        ]
                    },
                    {
                        test: /\.less$/,// 用来匹配 .less 结尾的文件
                        use: [ // use 数组里面 Loader 执行顺序是从右到左
                            MiniCssExtractPlugin.loader, // 将js中css通过创建style标签的形式添加到html标签中
                            {
                                loader: 'css-loader',// 将css资源编译commonjs的模块到js中
                                // options: {
                                //     modules: true
                                // }
                            },
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
                            {
                                loader: "less-loader" // compiles Less to CSS
                            },
                        ]
                    },
                    {
                        test: /\.s[ac]ss$/,
                        use: [MiniCssExtractPlugin.loader, {
                            loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
                        }, {
                            loader: "postcss-loader",
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        "postcss-preset-env", // 能解决大多数样式兼容性问题
                                    ],
                                },
                            },
                        }, {
                            loader: "sass-loader" // 将 Sass 编译成 CSS
                        },]
                    },
                    {
                        test: /\.styl$/,
                        use: [MiniCssExtractPlugin.loader, "css-loader", {
                            loader: "postcss-loader",
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        "postcss-preset-env", // 能解决大多数样式兼容性问题
                                    ],
                                },
                            },
                        }, "stylus-loader",],
                    },
                    {
                        test: /\.(png|jpe?g|gif|webp)$/,
                        type: "asset", // webpack5内置模块 会转成base64
                        parser: {
                            dataUrlCondition: {
                                maxSize: 60 * 1024 // // 小于60kb的图片会被base64处理
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
                        exclude: /node_modules/, // 排除node_modules代码不编译
                        use: [
                            {
                                loader: "thread-loader",
                                options: {
                                    work: threads,// 进程数量
                                },
                            },
                            {
                                loader: "babel-loader",
                                options: {
                                    cacheDirectory: true, // 开启babel编译缓存
                                    cacheCompression: false, // 缓存文件不要压缩
                                    plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积
                                },
                            }
                        ]
                    },
                ]
            }

        ],
    },
    // 插件
    plugins: [
        new ESLintWebpackPlugin({
            // 指定检查文件的根目录
            context: path.resolve(__dirname, "../src"),
            exclude: "node_modules",// 默认值
            cache: true, // 开启缓存
            // 缓存目录
            cacheLocation: path.resolve(
                __dirname,
                "../node_modules/.cache/.eslintcache"
            ),
            threads, // 开启多进程，设置进程数量
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
        // new CssMinimizerPlugin(), // css压缩
        // new TerserPlugin({
        //     // 内置多进程插件
        //     parallel: threads // 开启多进程
        // }),
        new PreloadWebpackPlugin({
            rel: "preload", // preload兼容性更好
            as: "script",
            // rel: 'prefetch' // prefetch兼容性更差
          }),
    ],
    optimization: {
        // webpack5一般存放压缩位置
        minimize: true,
        minimizer: [
            // css压缩也可以写到optimization.minimizer里面，效果一样的
            new CssMinimizerPlugin(),
            // 当生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
            new TerserPlugin({
                parallel: threads // 开启多进程
            }),
            // 压缩图片
            // new ImageMinimizerPlugin({
            //     minimizer: {
            //         implementation: ImageMinimizerPlugin.imageminGenerate,
            //         options: {
            //             plugins: [
            //                 ["gifsicle", { interlaced: true }],
            //                 ["jpegtran", { progressive: true }],
            //                 ["optipng", { optimizationLevel: 5 }],
            //                 [
            //                     "svgo",
            //                     {
            //                         plugins: [
            //                             "preset-default",
            //                             "prefixIds",
            //                             {
            //                                 name: "sortAttrs",
            //                                 params: {
            //                                     xmlnsOrder: "alphabetical",
            //                                 },
            //                             },
            //                         ],
            //                     },
            //                 ],
            //             ],
            //         },
            //     },
            // }),
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
    // 模式 开发模式：development 生产模式：production
    mode: "production",
    devtool: "source-map",
};
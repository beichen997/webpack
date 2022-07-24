const path = require('path')
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 打包生成的js文件自动加载index.html 文件中
// nodejs核心模块，直接使用
const os = require("os");
// cpu核数
const threads = os.cpus().length;
module.exports = {
    // 入口
    entry: "./src/main.js",
    // 输出
    output: {
        // path: 文件输出目录，必须是绝对路径
        // path.resolve()方法返回一个绝对路径
        // __dirname 当前文件的文件夹绝对路径,由于webpack.dev.js在config中座椅绝对路径需要回退../
        // path: path.resolve(__dirname, "../dist"),
        path: undefined,//开发模式不需要输出
        // filename: 输出文件名
        filename: "static/js/main.js",

        // clean: true, // 在打包前自动清空path目录
    },

    // 加载器
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.css$/,// 用来匹配 .css 结尾的文件
                        use: [ // use 数组里面 Loader 执行顺序是从右到左
                            { loader: 'style-loader' }, // 将js中css通过创建style标签的形式添加到html标签中
                            {
                                loader: 'css-loader',// 将css资源编译commonjs的模块到js中
                                // options: {
                                //     modules: true
                                // }
                            }
                        ]
                    },
                    {
                        test: /\.less$/,// 用来匹配 .less 结尾的文件
                        use: [ // use 数组里面 Loader 执行顺序是从右到左
                            { loader: 'style-loader' }, // 将js中css通过创建style标签的形式添加到html标签中
                            {
                                loader: 'css-loader',// 将css资源编译commonjs的模块到js中
                                // options: {
                                //     modules: true
                                // }
                            },
                            {
                                loader: "less-loader" // compiles Less to CSS
                            }
                        ]
                    },
                    {
                        test: /\.s[ac]ss$/,
                        use: [{
                            loader: "style-loader" // 将 JS 字符串生成为 style 节点
                        }, {
                            loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
                        }, {
                            loader: "sass-loader" // 将 Sass 编译成 CSS
                        }]
                    },
                    {
                        test: /\.styl$/,
                        use: ["style-loader", "css-loader", "stylus-loader"],
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
                                    work:threads,// 进程数量
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
            threads,
        }),
        new HtmlWebpackPlugin({
            // 以 public/index.html 为模板创建文件
            // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
            template: path.resolve(__dirname, "../public/index.html"),
        }),
    ],
    // 开发服务器
    devServer: {
        host: "localhost", // 启动服务器域名
        port: "3000", // 启动服务器端口号
        open: true, // 是否自动打开浏览器
        hot: true, // 开启HMR功能（只能用于开发环境，生产环境不需要了）
    },
    // 模式 开发模式：development 生产模式：production
    mode: "development",
    devtool: "cheap-module-source-map",
};
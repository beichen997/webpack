# webpack

#### 介绍
webpack5.0讲解以及各种原理代码示例

#### 软件架构
软件架构说明


#### 安装教程

1.  xxxx
2.  xxxx
3.  xxxx

#### 使用说明

1.  本文主要讲解webpack5.0
2.  分为基础，高级，项目，原理四大部分
3.  需要对nodejs 的各个核心模块有一定了解（fs,path,os）
4.  需要对react，vue有一定的了解

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  为什么需要打包工具
2.  开发时，我们会使用框架（React、Vue），ES6 模块化语法，Less/Sass 等 css 预处理器等语法进行开发。
3.  这样的代码要想在浏览器运行必须经过编译成浏览器能识别的 JS、Css 等语法，才能运行
4.  所以我们需要打包工具帮我们做完这些事。
5.  除此之外，打包工具还能压缩代码、做兼容性处理、提升代码性能等。

#### webpack基本

1.  Webpack 是一个静态资源打包工具。
2.  它会以一个或多个文件作为打包的入口，将我们整个项目所有文件编译组合成一个或多个文件输出出去。
3.  输出的文件就是编译好的文件，就可以在浏览器段运行了
4.  我们将 Webpack 输出的文件叫做 bundle。
#### webpack功能介绍

1.  Webpack 本身功能是有限的:
2.  开发模式：仅能编译 JS 中的 ES Module 语法
3.  生产模式：能编译 JS 中的 ES Module 语法，还能压缩 JS 代码

#### webpack基本配置

1.  entry（入口）
指示 Webpack 从哪个文件开始打包

2. output（输出）
指示 Webpack 打包完的文件输出到哪里去，如何命名等

3. loader（加载器）
webpack 本身只能处理 js、json 等资源，其他资源需要借助 loader，Webpack 才能解析

4. plugins（插件）
扩展 Webpack 的功能

5. mode（模式）

##### 处理样式资源
Webpack 本身是不能识别样式资源的，所以我们需要借助 Loader 来帮助 Webpack 解析样式资源

我们找 Loader 都应该去官方文档中找到对应的 Loader，然后使用

官方文档找不到的话，可以从社区 Github 中搜索查询

npm i css-loader style-loader -D
const path = require("path");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  module: {
    rules: [
      {
        // 用来匹配 .css 结尾的文件
        test: /\.css$/,
        // use 数组里面 Loader 执行顺序是从右到左
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [],
  mode: "development",
};

#### 处理图片资源

1. 过去在 Webpack4 时，我们处理图片资源通过 file-loader 和 url-loader 进行处理

2. 现在 Webpack5 已经将两个 Loader 功能内置到 Webpack 里了，我们只需要简单配置即可处理图片资源

3. {
        test: /\.(png|jpe?g|gif|webp)$/,
        type: "asset",
      },



#### 修改输出资源的名称和路径

output: {
    path: path.resolve(__dirname, "dist"), 
    filename: "static/js/main.js", // 将 js 文件输出到 static/js 目录中 针对的是入口文件
  },

##### 自动清空上次打包资源
1. 配置 output:{clean:true}


#### 字体图标
  {
    test: /\.(ttf|woff2?|map4|map3|avi)$/,
    type: "asset/resource",
    generator: {
      filename: "static/media/[hash:8][ext][query]",
    },
  },

  type: "asset/resource"和type: "asset"的区别：

  type: "asset/resource" 相当于file-loader, 将文件转化成 Webpack 能识别的资源，其他不做处理
  type: "asset" 相当于url-loader, 将文件转化成 Webpack 能识别的资源，同时小于某个大小的资源会处理成 data URI 形式

#### 处理JS资源
1. 有人可能会问，js 资源 Webpack 不能已经处理了吗，为什么我们还要处理呢？

2. 原因是 Webpack 对 js 处理是有限的，只能编译 js 中 ES 模块化语法，不能编译其他语法，导致 js 不能在 IE 等浏览器运行，所以我们希望做一些兼容性处理。

3. 其次开发中，团队对代码格式是有严格要求的，我们不能由肉眼去检测代码格式，需要使用专业的工具来检测。

4. 针对 js 兼容性处理，我们使用 Babel 来完成
5. 针对代码格式，我们使用 Eslint 来完成

#####  Eslint

  可组装的 JavaScript 和 JSX 检查工具。

  这句话意思就是：它是用来检测 js 和 jsx 语法的工具，可以配置各项功能

  我们使用 Eslint，关键是写 Eslint 配置文件，里面写上各种 rules 规则，将来运行 Eslint 时就会以写的规则对代码进行检查

1. 配置文件
  配置文件由很多种写法：

  .eslintrc.*：新建文件，位于项目根目录
  .eslintrc
  .eslintrc.js
  .eslintrc.json
  区别在于配置格式不一样
  package.json 中 eslintConfig：不需要创建文件，在原有文件基础上写
  ESLint 会查找和自动读取它们，所以以上配置文件只需要存在一个即可

2. 具体配置

  我们以 .eslintrc.js 配置文件为例：

  module.exports = {
    // 解析选项
    parserOptions: {},
    // 具体检查规则
    rules: {},
    // 继承其他规则
    extends: [],
    // ...
    // 其他规则详见：https://eslint.bootcss.com/docs/user-guide/configuring
  };

3. parserOptions 解析选项

  parserOptions: {
    ecmaVersion: 6, // ES 语法版本
    sourceType: "module", // ES 模块化
    ecmaFeatures: { // ES 其他特性
      jsx: true // 如果是 React 项目，就需要开启 jsx 语法
    }
  }

4. rules 具体规则
  "off" 或 0 - 关闭规则
  "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
  "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)

  rules: {
    semi: "error", // 禁止使用分号
    'array-callback-return': 'warn', // 强制数组方法的回调函数中有 return 语句，否则警告
    'default-case': [
      'warn', // 要求 switch 语句中有 default 分支，否则警告
      { commentPattern: '^no default$' } // 允许在最后注释 no default, 就不会有警告了
    ],
    eqeqeq: [
      'warn', // 强制使用 === 和 !==，否则警告
      'smart' // https://eslint.bootcss.com/docs/rules/eqeqeq#smart 除了少数情况下不会有警告
    ],
  }

5. extends 继承
  开发中一点点写 rules 规则太费劲了，所以有更好的办法，继承现有的规则。

  现有以下较为有名的规则：

  Eslint 官方的规则：eslint:recommended
  Vue Cli 官方的规则：plugin:vue/essential
  React Cli 官方的规则：react-app

  // 例如在React项目中，我们可以这样写配置
  module.exports = {
    extends: ["react-app"],
    rules: {
      // 我们的规则会覆盖掉react-app的规则
      // 所以想要修改规则直接改就是了
      eqeqeq: ["warn", "smart"],
    },
  };

##### 在 Webpack 中使用
1. 下载包 npm i eslint-webpack-plugin eslint -D

2. 定义 Eslint 配置文件.eslintrc.js
  module.exports = {
    // 继承 Eslint 规则
    extends: ["eslint:recommended"],
    env: {
      node: true, // 启用node中全局变量
      browser: true, // 启用浏览器中全局变量
    },
    parserOptions: {
      ecmaVersion: 6,
      sourceType: "module",
    },
    rules: {
      "no-var": 2, // 不能使用 var 定义变量
    },
  };

4. webpack.config.js 配置
  const path = require("path");
  const ESLintWebpackPlugin = require("eslint-webpack-plugin");

  module.exports = {
    entry: "./src/main.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "static/js/main.js", // 将 js 文件输出到 static/js 目录中
      clean: true, // 自动将上次打包目录资源清空
    },
    module: {
      rules: [
        {
          // 用来匹配 .css 结尾的文件
          test: /\.css$/,
          // use 数组里面 Loader 执行顺序是从右到左
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.less$/,
          use: ["style-loader", "css-loader", "less-loader"],
        },
        {
          test: /\.s[ac]ss$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.styl$/,
          use: ["style-loader", "css-loader", "stylus-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|webp)$/,
          type: "asset",
          parser: {
            dataUrlCondition: {
              maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
            },
          },
          generator: {
            // 将图片文件输出到 static/imgs 目录中
            // 将图片文件命名 [hash:8][ext][query]
            // [hash:8]: hash值取8位
            // [ext]: 使用之前的文件扩展名
            // [query]: 添加之前的query参数
            filename: "static/imgs/[hash:8][ext][query]",
          },
        },
        {
          test: /\.(ttf|woff2?)$/,
          type: "asset/resource",
          generator: {
            filename: "static/media/[hash:8][ext][query]",
          },
        },
      ],
    },
    plugins: [
      new ESLintWebpackPlugin({
        // 指定检查文件的根目录
        context: path.resolve(__dirname, "src"),
      }),
    ],
    mode: "development",
  };

5. .eslintignore 
# 忽略dist目录下所有文件
dist

###### Babel JavaScript 编译器。

  主要用于将 ES6 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中
  箭头函数 结构赋值等等

1. 配置文件 配置文件由很多种写法：

  babel.config.*：新建文件，位于项目根目录
  babel.config.js
  babel.config.json
  .babelrc.*：新建文件，位于项目根目录
  .babelrc
  .babelrc.js
  .babelrc.json
  package.json 中 babel：不需要创建文件，在原有文件基础上写
  Babel 会查找和自动读取它们，所以以上配置文件只需要存在一个即可

2. 具体配置
  我们以 babel.config.js 配置文件为例：
  module.exports = {
    // 预设
    presets: [],
  };

  presets 预设
  简单理解：就是一组 Babel 插件, 扩展 Babel 功能

  @babel/preset-env: 一个智能预设，允许您使用最新的 JavaScript。
  @babel/preset-react：一个用来编译 React jsx 语法的预设
  @babel/preset-typescript：一个用来编译 TypeScript 语法的预设
3. 在 Webpack 中使用

  下载包 npm i babel-loader @babel/core @babel/preset-env -D

  定义 Babel 配置文件
  babel.config.js
  module.exports = {
    presets: ["@babel/preset-env"],
  };

4. 配置
  const path = require("path");
  const ESLintWebpackPlugin = require("eslint-webpack-plugin");

  module.exports = {
    entry: "./src/main.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "static/js/main.js", // 将 js 文件输出到 static/js 目录中
      clean: true, // 自动将上次打包目录资源清空
    },
    module: {
      rules: [
        {
          // 用来匹配 .css 结尾的文件
          test: /\.css$/,
          // use 数组里面 Loader 执行顺序是从右到左
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.less$/,
          use: ["style-loader", "css-loader", "less-loader"],
        },
        {
          test: /\.s[ac]ss$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.styl$/,
          use: ["style-loader", "css-loader", "stylus-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|webp)$/,
          type: "asset",
          parser: {
            dataUrlCondition: {
              maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
            },
          },
          generator: {
            // 将图片文件输出到 static/imgs 目录中
            // 将图片文件命名 [hash:8][ext][query]
            // [hash:8]: hash值取8位
            // [ext]: 使用之前的文件扩展名
            // [query]: 添加之前的query参数
            filename: "static/imgs/[hash:8][ext][query]",
          },
        },
        {
          test: /\.(ttf|woff2?)$/,
          type: "asset/resource",
          generator: {
            filename: "static/media/[hash:8][ext][query]",
          },
        },
        {
          test: /\.js$/,
          exclude: /node_modules/, // 排除node_modules代码不编译
          loader: "babel-loader",
        },
      ],
    },
    plugins: [
      new ESLintWebpackPlugin({
        // 指定检查文件的根目录
        context: path.resolve(__dirname, "src"),
      }),
    ],
    mode: "development",
  };


#### 处理html资源
  html-webpack-plugin 插件将打包生成的js资源自动生成到index.html文件上
1. 下载 npm i html-webpack-plugin -D
2. webpack基本配置
  const path = require("path");
  const ESLintWebpackPlugin = require("eslint-webpack-plugin");
  const HtmlWebpackPlugin = require("html-webpack-plugin");
  module.exports = {
    entry: "./src/main.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "static/js/main.js", // 将 js 文件输出到 static/js 目录中
      clean: true, // 自动将上次打包目录资源清空
    },
    module: {
      rules: [
        {
          // 用来匹配 .css 结尾的文件
          test: /\.css$/,
          // use 数组里面 Loader 执行顺序是从右到左
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.less$/,
          use: ["style-loader", "css-loader", "less-loader"],
        },
        {
          test: /\.s[ac]ss$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.styl$/,
          use: ["style-loader", "css-loader", "stylus-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|webp)$/,
          type: "asset",
          parser: {
            dataUrlCondition: {
              maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
            },
          },
          generator: {
            // 将图片文件输出到 static/imgs 目录中
            // 将图片文件命名 [hash:8][ext][query]
            // [hash:8]: hash值取8位
            // [ext]: 使用之前的文件扩展名
            // [query]: 添加之前的query参数
            filename: "static/imgs/[hash:8][ext][query]",
          },
        },
        {
          test: /\.(ttf|woff2?)$/,
          type: "asset/resource",
          generator: {
            filename: "static/media/[hash:8][ext][query]",
          },
        },
        {
          test: /\.js$/,
          exclude: /node_modules/, // 排除node_modules代码不编译
          loader: "babel-loader",
        },
      ],
    },
    plugins: [
      new ESLintWebpackPlugin({
        // 指定检查文件的根目录
        context: path.resolve(__dirname, "src"),
      }),
      new HtmlWebpackPlugin({
        // 以 public/index.html 为模板创建文件
        // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
        template: path.resolve(__dirname, "public/index.html"),
      }),
    ],
    mode: "development",
  };

#### 开发服务器&自动化 每次写完代码都需要手动输入指令才能编译代码，太麻烦了，我们希望一切自动化
1. npm i webpack-dev-server -D
2. 配置webpack.config.js
  const path = require("path");
  const ESLintWebpackPlugin = require("eslint-webpack-plugin");
  const HtmlWebpackPlugin = require("html-webpack-plugin");

  module.exports = {
    entry: "./src/main.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "static/js/main.js", // 将 js 文件输出到 static/js 目录中
      clean: true, // 自动将上次打包目录资源清空
    },
    module: {
      rules: [
        {
          // 用来匹配 .css 结尾的文件
          test: /\.css$/,
          // use 数组里面 Loader 执行顺序是从右到左
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.less$/,
          use: ["style-loader", "css-loader", "less-loader"],
        },
        {
          test: /\.s[ac]ss$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.styl$/,
          use: ["style-loader", "css-loader", "stylus-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|webp)$/,
          type: "asset",
          parser: {
            dataUrlCondition: {
              maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
            },
          },
          generator: {
            // 将图片文件输出到 static/imgs 目录中
            // 将图片文件命名 [hash:8][ext][query]
            // [hash:8]: hash值取8位
            // [ext]: 使用之前的文件扩展名
            // [query]: 添加之前的query参数
            filename: "static/imgs/[hash:8][ext][query]",
          },
        },
        {
          test: /\.(ttf|woff2?)$/,
          type: "asset/resource",
          generator: {
            filename: "static/media/[hash:8][ext][query]",
          },
        },
        {
          test: /\.js$/,
          exclude: /node_modules/, // 排除node_modules代码不编译
          loader: "babel-loader",
        },
      ],
    },
    plugins: [
      new ESLintWebpackPlugin({
        // 指定检查文件的根目录
        context: path.resolve(__dirname, "src"),
      }),
      new HtmlWebpackPlugin({
        // 以 public/index.html 为模板创建文件
        // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
        template: path.resolve(__dirname, "public/index.html"),
      }),
    ],
    // 开发服务器
    devServer: {
      host: "localhost", // 启动服务器域名
      port: "3000", // 启动服务器端口号
      open: true, // 是否自动打开浏览器
    },
    mode: "development",
  };


  <!-- 完整版webpack.config.js -->
  const path = require('path')
  const ESLintWebpackPlugin = require("eslint-webpack-plugin");
  const HtmlWebpackPlugin = require("html-webpack-plugin"); // 打包生成的js文件自动加载index.html 文件中
  module.exports = {
      // 入口
      entry: "./src/main.js",
      // 输出
      output: {
          // path: 文件输出目录，必须是绝对路径
          // path.resolve()方法返回一个绝对路径
          // __dirname 当前文件的文件夹绝对路径
          path: path.resolve(__dirname, "dist"),
          // filename: 输出文件名
          filename: "static/js/main.js",

          clean: true, // 在打包前自动清空path目录
      },
      // 加载器
      module: {
          rules: [
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
                  loader: "babel-loader",
              },

          ],
      },
      // 插件
      plugins: [
          new ESLintWebpackPlugin({
              // 指定检查文件的根目录
              context: path.resolve(__dirname, "src"),
          }),
          new HtmlWebpackPlugin({
              // 以 public/index.html 为模板创建文件
              // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
              template: path.resolve(__dirname, "public/index.html"),
          }),
      ],
      // 开发服务器
      devServer: {
          host: "localhost", // 启动服务器域名
          port: "3000", // 启动服务器端口号
          open: true, // 是否自动打开浏览器
      },
      // 模式 开发模式：development 生产模式：production
      mode: "development",
  };
##### 生产模式介绍 生产模式是开发完成代码后，我们需要得到代码将来部署上线。

  这个模式下我们主要对代码进行优化，让其运行性能更好。

  优化主要从两个角度出发:

  优化代码运行性能
  优化代码打包速度

#### 生产模式准备
  我们分别准备两个配置文件来放不同的配置

1. 文件目录

├── webpack-test (项目根目录)
    ├── config (Webpack配置文件目录)
    │    ├── webpack.dev.js(开发模式配置文件)
    │    └── webpack.prod.js(生产模式配置文件)
    ├── node_modules (下载包存放目录)
    ├── src (项目源码目录，除了html其他都在src里面)
    │    └── 略
    ├── public (项目html文件)
    │    └── index.html
    ├── .eslintrc.js(Eslint配置文件)
    ├── babel.config.js(Babel配置文件)
    └── package.json (包的依赖管理配置文件)

### 修改 webpack.dev.js
 output: {
    path: undefined, // 开发模式没有输出，不需要指定输出目录
    filename: "static/js/main.js", // 将 js 文件输出到 static/js 目录中
    // clean: true, // 开发模式没有输出，不需要清空输出结果
  },
运行开发模式的指令：npx webpack serve --config ./config/webpack.dev.js

修改 webpack.prod.js
    output: {
      path: path.resolve(__dirname, "../dist"), // 生产模式需要输出
      filename: "static/js/main.js", // 将 js 文件输出到 static/js 目录中
      clean: true,
    },

    plugins: [
      new ESLintWebpackPlugin({
        // 指定检查文件的根目录
        context: path.resolve(__dirname, "../src"),
      }),
      new HtmlWebpackPlugin({
        // 以 public/index.html 为模板创建文件
        // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
        template: path.resolve(__dirname, "../public/index.html"),
      }),
    ],
    // devServer: {
    //   host: "localhost", // 启动服务器域名
    //   port: "3000", // 启动服务器端口号
    //   open: true, // 是否自动打开浏览器
    // },
  运行生产模式的指令：
  npx webpack --config ./config/webpack.prod.js

### 配置运行指令
  为了方便运行不同模式的指令，我们将指令定义在 package.json 中 scripts 里面
  // package.json
  {
    // 其他省略
    "scripts": {
      "start": "npm run dev",
      "dev": "npx webpack serve --config ./config/webpack.dev.js",
      "build": "npx webpack --config ./config/webpack.prod.js"
    }
  }
以后启动指令：

开发模式：npm start 或 npm run dev
生产模式：npm run build


###### Css 处理
  #提取 Css 成单独文件
  Css 文件目前被打包到 js 文件中，当 js 文件加载时，会创建一个 style 标签来生成样式

  这样对于网站来说，会出现闪屏现象，用户体验不好

  我们应该是单独的 Css 文件，通过 link 标签加载性能才好

1. 下载包npm i mini-css-extract-plugin -D
2. 配置webpack.prod.js 
  将style-loader改成MiniCssExtractPlugin.loader
  const path = require("path");
  const ESLintWebpackPlugin = require("eslint-webpack-plugin");
  const HtmlWebpackPlugin = require("html-webpack-plugin");
  const MiniCssExtractPlugin = require("mini-css-extract-plugin");

  module.exports = {
    entry: "./src/main.js",
    output: {
      path: path.resolve(__dirname, "../dist"), // 生产模式需要输出
      filename: "static/js/main.js", // 将 js 文件输出到 static/js 目录中
      clean: true,
    },
    module: {
      rules: [
        {
          // 用来匹配 .css 结尾的文件
          test: /\.css$/,
          // use 数组里面 Loader 执行顺序是从右到左
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
          test: /\.less$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
        },
        {
          test: /\.s[ac]ss$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
        {
          test: /\.styl$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "stylus-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|webp)$/,
          type: "asset",
          parser: {
            dataUrlCondition: {
              maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
            },
          },
          generator: {
            // 将图片文件输出到 static/imgs 目录中
            // 将图片文件命名 [hash:8][ext][query]
            // [hash:8]: hash值取8位
            // [ext]: 使用之前的文件扩展名
            // [query]: 添加之前的query参数
            filename: "static/imgs/[hash:8][ext][query]",
          },
        },
        {
          test: /\.(ttf|woff2?)$/,
          type: "asset/resource",
          generator: {
            filename: "static/media/[hash:8][ext][query]",
          },
        },
        {
          test: /\.js$/,
          exclude: /node_modules/, // 排除node_modules代码不编译
          loader: "babel-loader",
        },
      ],
    },
    plugins: [
      new ESLintWebpackPlugin({
        // 指定检查文件的根目录
        context: path.resolve(__dirname, "../src"),
      }),
      new HtmlWebpackPlugin({
        // 以 public/index.html 为模板创建文件
        // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
        template: path.resolve(__dirname, "../public/index.html"),
      }),
      // 提取css成单独文件
      new MiniCssExtractPlugin({
        // 定义输出文件名和目录
        filename: "static/css/main.css",
      }),
    ],
    // devServer: {
    //   host: "localhost", // 启动服务器域名
    //   port: "3000", // 启动服务器端口号
    //   open: true, // 是否自动打开浏览器
    // },
    mode: "production",
  };



#### Css 兼容性处理
1. 下载包npm i postcss-loader postcss postcss-preset-env -D
2. 配置
  webpack.prod.js

  postcss-loader应该放在css-loader加载之前，less-loader,sass-loader加载之后

  const path = require("path");
  const ESLintWebpackPlugin = require("eslint-webpack-plugin");
  const HtmlWebpackPlugin = require("html-webpack-plugin");
  const MiniCssExtractPlugin = require("mini-css-extract-plugin");

  module.exports = {
    entry: "./src/main.js",
    output: {
      path: path.resolve(__dirname, "../dist"), // 生产模式需要输出
      filename: "static/js/main.js", // 将 js 文件输出到 static/js 目录中
      clean: true,
    },
    module: {
      rules: [
        {
          // 用来匹配 .css 结尾的文件
          test: /\.css$/,
          // use 数组里面 Loader 执行顺序是从右到左
          use: [
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
          ],
        },
        {
          test: /\.less$/,
          use: [
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
            "less-loader",
          ],
        },
        {
          test: /\.s[ac]ss$/,
          use: [
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
            "sass-loader",
          ],
        },
        {
          test: /\.styl$/,
          use: [
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
            "stylus-loader",
          ],
        },
        {
          test: /\.(png|jpe?g|gif|webp)$/,
          type: "asset",
          parser: {
            dataUrlCondition: {
              maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
            },
          },
          generator: {
            // 将图片文件输出到 static/imgs 目录中
            // 将图片文件命名 [hash:8][ext][query]
            // [hash:8]: hash值取8位
            // [ext]: 使用之前的文件扩展名
            // [query]: 添加之前的query参数
            filename: "static/imgs/[hash:8][ext][query]",
          },
        },
        {
          test: /\.(ttf|woff2?)$/,
          type: "asset/resource",
          generator: {
            filename: "static/media/[hash:8][ext][query]",
          },
        },
        {
          test: /\.js$/,
          exclude: /node_modules/, // 排除node_modules代码不编译
          loader: "babel-loader",
        },
      ],
    },
    plugins: [
      new ESLintWebpackPlugin({
        // 指定检查文件的根目录
        context: path.resolve(__dirname, "../src"),
      }),
      new HtmlWebpackPlugin({
        // 以 public/index.html 为模板创建文件
        // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
        template: path.resolve(__dirname, "../public/index.html"),
      }),
      // 提取css成单独文件
      new MiniCssExtractPlugin({
        // 定义输出文件名和目录
        filename: "static/css/main.css",
      }),
    ],
    // devServer: {
    //   host: "localhost", // 启动服务器域名
    //   port: "3000", // 启动服务器端口号
    //   open: true, // 是否自动打开浏览器
    // },
    mode: "production",
  };

3. 控制兼容性
  我们可以在 package.json 文件中添加 browserslist 来控制样式的兼容性做到什么程度。
  {
    // 其他省略
    "browserslist": ["ie >= 8"]
  }
  想要知道更多的 browserslist 配置，查看browserslist 文档

  以上为了测试兼容性所以设置兼容浏览器 ie8 以上。

  实际开发中我们一般不考虑旧版本浏览器了，所以我们可以这样设置：
  {
    // 其他省略
    "browserslist": ["last 2 version", "> 1%", "not dead"]
  }

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


  {
    test: /\.less$/,
    use: getStyleLoaders("less-loader"),
  },
#### Css 压缩
1. 下载包npm i css-minimizer-webpack-plugin -D
  const path = require('path')
  const ESLintWebpackPlugin = require("eslint-webpack-plugin");
  const HtmlWebpackPlugin = require("html-webpack-plugin"); // 打包生成的js文件自动加载index.html 文件中
  const MiniCssExtractPlugin = require("mini-css-extract-plugin");
  const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

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
          filename: "static/js/main.js",

          clean: true, // 在打包前自动清空path目录
      },
      // 加载器
      module: {
          rules: [
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
                  },{
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
                  use: [MiniCssExtractPlugin.loader, "css-loader",{
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
                  loader: "babel-loader",
              },

          ],
      },
      // 插件
      plugins: [
          new ESLintWebpackPlugin({
              // 指定检查文件的根目录
              context: path.resolve(__dirname, "../src"),
          }),
          new HtmlWebpackPlugin({
              // 以 public/index.html 为模板创建文件
              // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
              template: path.resolve(__dirname, "../public/index.html"),
          }),
          // 提取css成单独文件
          new MiniCssExtractPlugin({
              // 定义输出文件名和目录
              filename: "static/css/main.css",
          }),
          new MiniCssExtractPlugin(), // css压缩
      ],
      // 模式 开发模式：development 生产模式：production
      mode: "production",
  };

#### html 压缩
  默认生产模式已经开启了：html 压缩和 js 压缩

  不需要额外进行配置


#### 主要讲解了
  两种开发模式
  开发模式：代码能编译自动化运行
  生产模式：代码编译优化输出
  Webpack 基本功能
  开发模式：可以编译 ES Module 语法
  生产模式：可以编译 ES Module 语法，压缩 js 代码
  Webpack 配置文件
  5 个核心概念
  entry
  output
  loader
  plugins
  mode
  devServer 配置
  Webpack 脚本指令用法
  webpack 直接打包输出
  webpack serve 启动开发服务器，内存编译打包没有输出
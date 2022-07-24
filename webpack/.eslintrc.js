module.exports = {
    // 继承 Eslint 规则
    extends: ["eslint:recommended"],
    parser: "@babel/eslint-parser", // 支持最新的最终 ECMAScript 标准
    env: {
      node: true, // 启用node中全局变量
      browser: true, // 启用浏览器中全局变量
    },
    plugins: ["import"], // 解决动态导入import语法报错问题 --> 实际使用eslint-plugin-import的规则解决的
    parserOptions: { // // 解析选项
      ecmaVersion: 6, // es6
      sourceType: "module", // 模块
    },
    rules: { // 具体检查规则
      "no-var": 2, // 不能使用 var 定义变量
      //就是这一句，禁用import和require必须出现在顶层作用域的验证规则
      "global-require": 0//这里应该0代表off
    },
  };
  
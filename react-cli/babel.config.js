module.exports = {
    presets: [
      "react-app", // 预设了需要内容使用babel-preset-react-app
      // 按需加载core-js的polyfill
      // { useBuiltIns: "usage", corejs: { version: "3", proposals: true } },
    ],

  };
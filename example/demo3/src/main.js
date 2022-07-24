console.log("hello main");

// document.getElementById("btn").onclick = function () {
//   // 动态导入 --> 实现按需加载
//   // import 动态导入，会将动态导入的文件代码分割（拆分成单独模块），在需要使用的时候自动加载
//   // 即使只被引用了一次，也会代码分割
//   import("./math.js").then(({ sum }) => {
//     alert(sum(1, 2, 3, 4, 5));
//   });
// };
document.getElementById("btn").onClick = function () {
  // eslint会对动态导入语法报错，需要修改eslint配置文件
  // webpackChunkName: "math"：这是webpack动态导入模块命名的方式
  // "math"将来就会作为[name]的值显示。
  import(/* webpackChunkName: "math" */ "./math.js").then(({ sum }) => {
    console.log(sum(2, 1));
  });
};
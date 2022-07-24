// loaders/loader1.js
/*
loader实际上就是一个函数
webpack解析资源时，会加载相应的loader
loader接受到文件内容为参数，进行处理，并返回相应内容
content 源文件的内容
map SourceMap 数据
meta 数据，可以是任何内容

*/
module.exports = function loader1(content,map,meta) {
    console.log("hello loader");
    return content;
  };
  